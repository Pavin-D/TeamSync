import { prisma } from '../config/database';
import { calculateHaversineDistanceKm } from './location.service';

export interface SearchQueryParams {
  q?: string;
  type?: 'ALL' | 'PEOPLE' | 'TEAMS' | 'EVENTS' | 'MENTORS' | 'COLLEGES' | 'SKILLS';
  role?: string;
  skills?: string[];
  collegeId?: string;
  collegeName?: string;
  departmentId?: string;
  departmentName?: string;
  eventId?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  availability?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export class SearchService {
  public static async globalSearch(params: SearchQueryParams) {
    const q = params.q?.trim() || '';
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;

    const [people, teams, events, mentors, colleges] = await Promise.all([
      SearchService.searchPeople({ ...params, q, limit: 5 }),
      SearchService.searchTeams({ ...params, q, limit: 5 }),
      SearchService.searchEvents({ ...params, q, limit: 5 }),
      SearchService.searchMentors({ ...params, q, limit: 5 }),
      SearchService.searchColleges({ ...params, q, limit: 5 }),
    ]);

    const totalCount =
      people.pagination.total +
      teams.pagination.total +
      events.pagination.total +
      mentors.pagination.total +
      colleges.pagination.total;

    return {
      query: q,
      people: people.people,
      teams: teams.teams,
      events: events.events,
      mentors: mentors.mentors,
      colleges: colleges.colleges,
      pagination: {
        page,
        limit,
        total: totalCount,
      },
    };
  }

  public static async searchPeople(params: SearchQueryParams) {
    const q = params.q?.trim() || '';
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      ...(params.role && params.role !== 'ALL' ? { role: params.role } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
              { studentProfile: { skills: { hasSome: [q] } } },
              { professionalProfile: { primarySkills: { hasSome: [q] } } },
            ],
          }
        : {}),
      ...(params.collegeId
        ? { studentProfile: { collegeId: params.collegeId } }
        : params.collegeName
        ? { studentProfile: { college: { name: { contains: params.collegeName, mode: 'insensitive' } } } }
        : {}),
      ...(params.departmentId
        ? { studentProfile: { departmentId: params.departmentId } }
        : params.departmentName
        ? { studentProfile: { department: { name: { contains: params.departmentName, mode: 'insensitive' } } } }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          studentProfile: {
            include: {
              college: { select: { id: true, name: true } },
              department: { select: { id: true, name: true } },
              location: true,
            },
          },
          professionalProfile: {
            include: {
              location: true,
            },
          },
          skills: { include: { skill: true } },
          participations: true,
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const formatted = users.map((u) => {
      const uLoc = u.studentProfile?.location || u.professionalProfile?.location;
      let distanceKm: number | null = null;
      if (params.latitude && params.longitude && uLoc?.latitude && uLoc?.longitude) {
        distanceKm = calculateHaversineDistanceKm(
          params.latitude,
          params.longitude,
          uLoc.latitude,
          uLoc.longitude
        );
      }

      const skills = u.skills.map((us) => us.skill.name);
      const githubSkillEvidence = u.skills.filter((us) => us.source === 'GITHUB').map((us) => us.skill.name);

      return {
        id: u.id,
        userId: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatarUrl: u.profileImage || undefined,
        college: u.studentProfile?.college?.name || null,
        department: u.studentProfile?.department?.name || null,
        company: u.professionalProfile?.company || null,
        jobTitle: u.professionalProfile?.jobTitle || null,
        skills,
        githubSkillEvidence,
        isAvailableForTeam: u.availableForTeamFormation ?? true,
        isAvailableAsMentor: u.availableAsMentor ?? false,
        participationsCount: u.participations.length,
        location: uLoc ? `${uLoc.city}, ${uLoc.state}` : null,
        distanceKm: distanceKm ? Math.round(distanceKm * 10) / 10 : null,
      };
    });

    return {
      people: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async searchTeams(params: SearchQueryParams) {
    const q = params.q?.trim() || '';
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { requiredSkills: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(params.eventId ? { eventId: params.eventId } : {}),
    };

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          event: { select: { id: true, title: true } },
          members: {
            include: {
              user: {
                include: {
                  studentProfile: { include: { college: { select: { id: true, name: true } } } },
                },
              },
            },
          },
        },
        skip,
        take: limit,
      }),
      prisma.team.count({ where }),
    ]);

    const formatted = teams.map((t) => {
      const maxMembers = t.maxMembers || 5;
      const currentMembersCount = t.members.length;
      const isFull = currentMembersCount >= maxMembers;

      const teamLeadMember = t.members.find((m) => m.role === 'LEAD') || t.members[0];
      const primaryCollege =
        t.members.find((m) => m.user.studentProfile?.college?.name)?.user.studentProfile?.college?.name || null;

      const skillsList = t.requiredSkills ? t.requiredSkills.split(',').map((s) => s.trim()) : [];

      return {
        id: t.id,
        teamId: t.id,
        name: t.name,
        description: t.description || null,
        eventTitle: t.event?.title || 'Open Hackathon Project',
        leaderName: teamLeadMember?.user.name || 'Team Lead',
        leaderAvatar: teamLeadMember?.user.profileImage || undefined,
        currentMembersCount,
        maxMembers,
        isFull,
        requiredSkills: skillsList,
        collegeName: primaryCollege,
        status: t.status,
      };
    });

    return {
      teams: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async searchEvents(params: SearchQueryParams) {
    const q = params.q?.trim() || '';
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { organizer: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          participations: true,
          teams: true,
        },
        orderBy: { startDate: 'asc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    const formatted = events.map((e) => ({
      id: e.id,
      eventId: e.id,
      title: e.title,
      description: e.description,
      organizer: e.organizer,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate.toISOString(),
      mode: e.mode,
      status: e.status,
      maxTeamSize: e.maxTeamSize,
      participantsCount: e.participations.length,
      teamsCount: e.teams.length,
    }));

    return {
      events: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async searchMentors(params: SearchQueryParams) {
    const q = params.q?.trim() || '';
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      role: 'PROFESSIONAL',
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { professionalProfile: { company: { contains: q, mode: 'insensitive' } } },
              { professionalProfile: { jobTitle: { contains: q, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [mentors, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          professionalProfile: { include: { location: true } },
          mentorSessions: true,
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const formatted = mentors.map((m: any) => {
      const prof = m.professionalProfile;
      return {
        id: m.id,
        mentorId: m.id,
        name: m.name,
        avatarUrl: m.profileImage || undefined,
        jobTitle: prof?.jobTitle || 'Industry Professional',
        company: prof?.company || 'Tech Leader',
        yearsOfExperience: prof?.yearsOfExperience || 3,
        primarySkills: prof?.primarySkills || [],
        availableForMentorship: m.availableAsMentor,
        maxActiveMentees: prof?.maxMentees || 3,
        currentActiveMenteesCount: m.mentorSessions.length,
        isVerified: prof?.isVerifiedProfessional ?? true,
      };
    });

    return {
      mentors: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async searchColleges(params: SearchQueryParams) {
    const q = params.q?.trim() || '';
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { emailDomain: { contains: q, mode: 'insensitive' } },
              { location: { city: { contains: q, mode: 'insensitive' } } },
              { location: { state: { contains: q, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        include: {
          location: true,
          students: true,
          departments: true,
        },
        skip,
        take: limit,
      }),
      prisma.college.count({ where }),
    ]);

    const formatted = colleges.map((c) => ({
      id: c.id,
      collegeId: c.id,
      name: c.name,
      emailDomain: c.emailDomain || null,
      location: c.location ? `${c.location.city}, ${c.location.state}` : null,
      studentsCount: c.students.length,
      departmentsCount: c.departments.length,
      isVerified: c.isVerified,
    }));

    return {
      colleges: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

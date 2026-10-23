import { prisma } from '../config/database';
import { NotificationService } from './notification.service';
import { calculateHaversineDistanceKm } from './location.service';

export class MentorshipService {
  public static async getMentors(queryParams: any, currentUserId?: string) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 12;
    const skip = (page - 1) * limit;

    const where: any = {
      role: 'PROFESSIONAL',
      isActive: true,
      ...(queryParams.search
        ? {
            OR: [
              { name: { contains: queryParams.search, mode: 'insensitive' } },
              { professionalProfile: { company: { contains: queryParams.search, mode: 'insensitive' } } },
              { professionalProfile: { jobTitle: { contains: queryParams.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    let userLoc: any = null;
    if (currentUserId) {
      const u = await prisma.user.findUnique({
        where: { id: currentUserId },
        include: {
          studentProfile: { include: { location: true } },
          professionalProfile: { include: { location: true } },
        },
      });
      userLoc = u?.studentProfile?.location || u?.professionalProfile?.location;
    }

    const [mentors, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          professionalProfile: { include: { location: true } },
          skills: { include: { skill: true } },
          githubAnalysis: { orderBy: { analyzedAt: 'desc' }, take: 1 },
          mentorSessions: { where: { status: { in: ['ACCEPTED', 'ACTIVE'] } } },
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.user.count({ where }),
    ]);

    const formatted = mentors.map((m) => {
      const mLoc = m.professionalProfile?.location;
      let distanceKm: number | null = null;
      if (userLoc && mLoc) {
        distanceKm = calculateHaversineDistanceKm(
          userLoc.latitude,
          userLoc.longitude,
          mLoc.latitude,
          mLoc.longitude
        );
      }

      const skills = m.skills.map((us) => us.skill.name);
      const activeSessionsCount = m.mentorSessions.length;

      return {
        id: m.id,
        mentorId: m.id,
        name: m.name,
        avatarUrl: m.profileImage || null,
        company: m.professionalProfile?.company || 'Industry Partner',
        jobTitle: m.professionalProfile?.jobTitle || 'Tech Leader',
        bio: m.professionalProfile?.bio || null,
        githubUrl: m.professionalProfile?.githubUrl || null,
        linkedinUrl: m.professionalProfile?.linkedinUrl || null,
        skills,
        distanceKm,
        activeMentorshipsCount: activeSessionsCount,
        availableForMentorship: activeSessionsCount < 3,
        availabilityStatus: activeSessionsCount >= 3 ? 'Capacity Reached (3/3)' : 'Available for Mentorship',
        city: mLoc?.city || 'Remote',
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

  public static async getMentorById(mentorId: string) {
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId },
      include: {
        professionalProfile: { include: { location: true } },
        skills: { include: { skill: true } },
        githubAnalysis: { orderBy: { analyzedAt: 'desc' }, take: 1 },
        mentorSessions: {
          include: {
            menteeTeam: { select: { id: true, name: true } },
            event: { select: { id: true, title: true } },
          },
        },
      },
    });

    if (!mentor || mentor.role !== 'PROFESSIONAL') {
      const error: any = new Error('Mentor profile not found.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const ghAnalysis = mentor.githubAnalysis[0];

    return {
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      avatarUrl: mentor.profileImage || null,
      company: mentor.professionalProfile?.company || 'Industry Partner',
      jobTitle: mentor.professionalProfile?.jobTitle || 'Tech Leader',
      bio: mentor.professionalProfile?.bio || null,
      githubUrl: mentor.professionalProfile?.githubUrl || null,
      linkedinUrl: mentor.professionalProfile?.linkedinUrl || null,
      availableAsMentor: mentor.availableAsMentor,
      skills: mentor.skills.map((us) => us.skill.name),
      githubEvidence: {
        repositoriesAnalyzed: ghAnalysis?.repositoriesAnalyzed || 0,
        languages: ghAnalysis?.languagesDetected ? JSON.parse(ghAnalysis.languagesDetected) : [],
      },
      mentorshipHistory: mentor.mentorSessions.map((s) => ({
        id: s.id,
        teamName: s.menteeTeam.name,
        eventTitle: s.event.title,
        status: s.status,
        createdAt: s.createdAt.toISOString(),
      })),
    };
  }

  public static async createRequest(requesterUserId: string, data: any) {
    let targetTeamId = data.teamId;
    let targetEventId = data.eventId;

    let team: any = null;
    if (targetTeamId) {
      team = await prisma.team.findUnique({
        where: { id: targetTeamId },
        select: { id: true, teamLeadId: true, name: true, eventId: true },
      });
    }

    if (!team) {
      const activeMember = await prisma.teamMember.findFirst({
        where: { userId: requesterUserId, status: 'ACTIVE' },
        include: { team: true },
      });

      if (activeMember?.team) {
        team = activeMember.team;
        targetTeamId = team.id;
        targetEventId = team.eventId;
      } else {
        const requesterUser = await prisma.user.findUnique({ where: { id: requesterUserId } });
        let firstEvent = await prisma.event.findFirst({ where: { status: { in: ['UPCOMING', 'ONGOING', 'COMPLETED'] } } });
        if (!firstEvent) {
          firstEvent = await prisma.event.findFirst();
        }

        if (firstEvent) {
          team = await prisma.team.create({
            data: {
              name: `${requesterUser?.name || 'Student'}'s Team`,
              eventId: firstEvent.id,
              teamLeadId: requesterUserId,
              maxMembers: 4,
              scope: 'GLOBAL',
              status: 'RECRUITING',
              members: {
                create: {
                  userId: requesterUserId,
                  role: 'LEAD',
                  status: 'ACTIVE',
                },
              },
            },
          });
          targetTeamId = team.id;
          targetEventId = firstEvent.id;
        }
      }
    }

    const mentor = await prisma.user.findUnique({
      where: { id: data.mentorId },
      select: { id: true, name: true, availableAsMentor: true, role: true },
    });

    if (!mentor || mentor.role !== 'PROFESSIONAL') {
      const error: any = new Error('Target mentor is currently unavailable.');
      error.statusCode = 400;
      error.code = 'MENTOR_UNAVAILABLE';
      throw error;
    }

    if (!targetTeamId) {
      const error: any = new Error('Mentorship request requires a team or project context.');
      error.statusCode = 400;
      error.code = 'TEAM_REQUIRED';
      throw error;
    }

    const existing = await prisma.mentorship.findFirst({
      where: {
        mentorId: data.mentorId,
        menteeTeamId: targetTeamId,
        status: { in: ['REQUESTED', 'ACCEPTED', 'ACTIVE'] },
      },
    });

    if (existing) {
      return existing;
    }

    const mentorship = await prisma.mentorship.create({
      data: {
        mentorId: data.mentorId,
        menteeTeamId: targetTeamId,
        eventId: targetEventId || team?.eventId,
        message: data.message || 'Student requested guidance for hackathon project.',
        status: 'REQUESTED',
      },
    });

    await NotificationService.createNotification({
      recipientId: data.mentorId,
      type: 'MENTOR_REQUEST',
      title: 'New Mentorship Request',
      message: `Student/Team "${team?.name || 'Applicant'}" requested you as an industry mentor.`,
      entityType: 'TEAM',
      entityId: targetTeamId,
    });

    return mentorship;
  }

  public static async getMyMentorshipRequests(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return [];

    if (user.role === 'PROFESSIONAL') {
      const requests = await prisma.mentorship.findMany({
        where: { mentorId: userId, status: 'REQUESTED' },
        include: {
          menteeTeam: {
            include: {
              teamLead: { select: { id: true, name: true, profileImage: true } },
              event: { select: { id: true, title: true } },
              members: { where: { status: 'ACTIVE' } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return requests.map((r: any) => ({
        id: r.id,
        teamId: r.menteeTeam?.id || r.id,
        teamName: r.menteeTeam?.name || 'Student Applicant',
        eventTitle: r.menteeTeam?.event?.title || 'Global Hackathon',
        teamLeadName: r.menteeTeam?.teamLead?.name || 'Student',
        menteeName: r.menteeTeam?.teamLead?.name || 'Student',
        membersCount: r.menteeTeam?.members?.length || 1,
        message: r.message,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      }));
    } else {
      // Student / Mentee teams
      const requests = await prisma.mentorship.findMany({
        where: {
          menteeTeam: {
            members: { some: { userId, status: 'ACTIVE' } },
          },
        },
        include: {
          mentor: {
            select: { id: true, name: true, profileImage: true, professionalProfile: true },
          },
          menteeTeam: { select: { id: true, name: true } },
          event: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return requests.map((r) => ({
        id: r.id,
        teamId: r.menteeTeam.id,
        teamName: r.menteeTeam.name,
        eventTitle: r.event.title,
        mentorName: r.mentor.name,
        company: r.mentor.professionalProfile?.company || 'Industry Partner',
        message: r.message,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      }));
    }
  }

  public static async getActiveMentorships(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return [];

    if (user.role === 'PROFESSIONAL') {
      const mentorships = await prisma.mentorship.findMany({
        where: { mentorId: userId, status: { in: ['ACCEPTED', 'ACTIVE'] } },
        include: {
          menteeTeam: {
            include: {
              teamLead: { select: { id: true, name: true, profileImage: true } },
              event: { select: { id: true, title: true } },
              members: { where: { status: 'ACTIVE' } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return mentorships.map((r) => ({
        id: r.id,
        teamId: r.menteeTeam?.id || r.id,
        teamName: r.menteeTeam?.name || 'Student Applicant',
        eventTitle: r.menteeTeam?.event?.title || 'Global Hackathon',
        teamLeadName: r.menteeTeam?.teamLead?.name || 'Student',
        menteeName: r.menteeTeam?.teamLead?.name || 'Student',
        membersCount: r.menteeTeam?.members?.length || 1,
        message: r.message,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      }));
    } else {
      const mentorships = await prisma.mentorship.findMany({
        where: {
          menteeTeam: {
            members: { some: { userId, status: 'ACTIVE' } },
          },
          status: { in: ['ACCEPTED', 'ACTIVE'] },
        },
        include: {
          mentor: {
            select: { id: true, name: true, profileImage: true, professionalProfile: true },
          },
          menteeTeam: { select: { id: true, name: true } },
          event: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return mentorships.map((r) => ({
        id: r.id,
        teamId: r.menteeTeam?.id || r.id,
        teamName: r.menteeTeam?.name || 'Student Applicant',
        eventTitle: r.event?.title || 'Global Hackathon',
        mentorName: r.mentor?.name || 'Mentor',
        company: r.mentor?.professionalProfile?.company || 'Industry Partner',
        message: r.message,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      }));
    }
  }

  public static async respondToRequest(mentorId: string, requestId: string, action: 'ACCEPT' | 'REJECT', _message?: string) {
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: requestId },
      include: {
        menteeTeam: { select: { id: true, name: true, teamLeadId: true } },
      },
    });

    if (!mentorship || mentorship.mentorId !== mentorId) {
      const error: any = new Error('Mentorship request not found or access denied.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';

    const updated = await prisma.mentorship.update({
      where: { id: requestId },
      data: { status: newStatus },
    });

    if (action === 'ACCEPT' && mentorship.menteeTeamId) {
      const existingMember = await prisma.teamMember.findFirst({
        where: { teamId: mentorship.menteeTeamId, userId: mentorId },
      });

      if (!existingMember) {
        await prisma.teamMember.create({
          data: {
            teamId: mentorship.menteeTeamId,
            userId: mentorId,
            role: 'ADVISOR' as any,
            status: 'ACTIVE',
          },
        });
      } else if (existingMember.status !== 'ACTIVE') {
        await prisma.teamMember.update({
          where: { id: existingMember.id },
          data: { status: 'ACTIVE' },
        });
      }
    }

    // Notify Team Lead
    if (mentorship.menteeTeam) {
      await NotificationService.createNotification({
        recipientId: mentorship.menteeTeam.teamLeadId,
        type: action === 'ACCEPT' ? 'MENTOR_ACCEPTED' : 'MENTOR_REJECTED',
        title: action === 'ACCEPT' ? 'Mentorship Request Accepted!' : 'Mentorship Request Update',
        message: action === 'ACCEPT'
          ? `Industry mentor accepted your request for team "${mentorship.menteeTeam.name}".`
          : `Your mentorship request for team "${mentorship.menteeTeam.name}" was declined.`,
        entityType: 'TEAM',
        entityId: mentorship.menteeTeam.id,
      });
    }

    return updated;
  }

  public static async getStaffMenteeAnalytics(staffUserId: string) {
    const mentorships = await prisma.mentorship.findMany({
      where: { mentorId: staffUserId, status: { in: ['ACCEPTED', 'ACTIVE'] } },
      include: {
        menteeTeam: {
          include: {
            event: { select: { id: true, title: true } },
            members: {
              include: {
                user: {
                  include: {
                    studentProfile: { include: { department: { select: { name: true } } } },
                    rankings: true,
                    participations: true,
                    skills: { include: { skill: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    const menteeMap: Record<string, any> = {};
    let totalMenteeWins = 0;
    let totalMenteeParticipations = 0;
    const skillCounts: Record<string, number> = {};

    mentorships.forEach((m) => {
      const team = m.menteeTeam;
      if (!team) return;

      team.members.forEach((mem) => {
        const u = mem.user;
        if (!u || u.id === staffUserId) return;

        if (!menteeMap[u.id]) {
          const wins = u.participations.filter((p) => p.result && p.result.toUpperCase().includes('WIN')).length;
          totalMenteeWins += wins;
          totalMenteeParticipations += u.participations.length;

          u.skills.forEach((us) => {
            const sName = us.skill.name;
            skillCounts[sName] = (skillCounts[sName] || 0) + 1;
          });

          menteeMap[u.id] = {
            studentId: u.id,
            name: u.name,
            email: u.email,
            department: u.studentProfile?.department?.name || 'General',
            teamName: team.name,
            eventTitle: team.event?.title || 'Hackathon',
            participationsCount: u.participations.length,
            winsCount: wins,
            score: u.rankings[0]?.score || 0,
            skills: u.skills.map((s) => s.skill.name).slice(0, 4),
          };
        }
      });
    });

    const menteeList = Object.values(menteeMap);
    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalMentees: menteeList.length,
      activeMenteeTeams: mentorships.length,
      totalMenteeWins,
      totalMenteeParticipations,
      topMenteeSkills: topSkills,
      mentees: menteeList,
    };
  }

  public static async inviteTeamAsMentor(staffUserId: string, teamId: string, message?: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { id: true, name: true, eventId: true, teamLeadId: true },
    });

    if (!team) {
      const error: any = new Error('Team not found.');
      error.statusCode = 404;
      throw error;
    }

    const staffUser = await prisma.user.findUnique({ where: { id: staffUserId } });

    const mentorship = await prisma.mentorship.create({
      data: {
        mentorId: staffUserId,
        menteeTeamId: teamId,
        eventId: team.eventId,
        message: message || `Staff member ${staffUser?.name || 'Faculty'} sent a mentorship invitation.`,
        status: 'ACCEPTED',
      },
    });

    await NotificationService.createNotification({
      recipientId: team.teamLeadId,
      type: 'MENTOR_INVITATION',
      title: 'Faculty Mentorship Offer!',
      message: `Staff member ${staffUser?.name || 'Faculty'} joined as a mentor for team "${team.name}".`,
      entityType: 'TEAM',
      entityId: teamId,
    });

    return mentorship;
  }
}

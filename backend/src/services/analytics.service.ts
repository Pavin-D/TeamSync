import { prisma } from '../config/database';
import { RankingService, DEFAULT_RANKING_WEIGHTS } from './ranking.service';

export class AnalyticsService {
  public static async getPersonalAnalytics(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            college: true,
            department: true,
          },
        },
        participations: {
          include: {
            event: { select: { id: true, title: true, startDate: true } },
            team: { select: { id: true, name: true } },
          },
        },
        teamMemberships: {
          include: {
            team: { select: { id: true, name: true, eventId: true } },
          },
        },
        teamLeadTeams: true,
      },
    });

    if (!user) {
      const error: any = new Error('User not found.');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    let wins = 0;
    let runnerUps = 0;
    let finalists = 0;
    let totalScore = 0;

    user.participations.forEach((p) => {
      const res = p.result ? p.result.toUpperCase() : 'PARTICIPATED';
      if (res === 'WINNER' || res === 'WIN') {
        wins += 1;
        totalScore += DEFAULT_RANKING_WEIGHTS.winner;
      } else if (res === 'RUNNER_UP' || res === 'RUNNER-UP' || res === 'SECOND') {
        runnerUps += 1;
        totalScore += DEFAULT_RANKING_WEIGHTS.runnerUp;
      } else if (res === 'FINALIST') {
        finalists += 1;
        totalScore += DEFAULT_RANKING_WEIGHTS.finalist;
      } else {
        totalScore += DEFAULT_RANKING_WEIGHTS.participation;
      }
    });

    totalScore += user.teamLeadTeams.length * DEFAULT_RANKING_WEIGHTS.leadership;

    // Get dynamic Global, College, and Department Ranks
    const allRankings = await RankingService.getStudentRankings({ limit: 10000 });
    const myGlobalEntry = allRankings.rankings.find((r) => r.studentId === userId);
    const globalRank = myGlobalEntry ? myGlobalEntry.rank : allRankings.rankings.length + 1;

    let collegeRank = null;
    let departmentRank = null;

    if (user.studentProfile?.collegeId) {
      const collegeRankings = await RankingService.getStudentRankings({
        collegeId: user.studentProfile.collegeId,
        limit: 10000,
      });
      const myCollegeEntry = collegeRankings.rankings.find((r) => r.studentId === userId);
      collegeRank = myCollegeEntry ? myCollegeEntry.rank : collegeRankings.rankings.length + 1;

      if (user.studentProfile?.departmentId) {
        const deptRankings = await RankingService.getStudentRankings({
          collegeId: user.studentProfile.collegeId,
          departmentId: user.studentProfile.departmentId,
          limit: 10000,
        });
        const myDeptEntry = deptRankings.rankings.find((r) => r.studentId === userId);
        departmentRank = myDeptEntry ? myDeptEntry.rank : deptRankings.rankings.length + 1;
      }
    }

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.studentProfile?.college?.name || null,
      department: user.studentProfile?.department?.name || null,
      totalEvents: user.participations.length,
      completedEvents: user.participations.length,
      wins,
      runnerUps,
      finalists,
      teamsJoinedCount: user.teamMemberships.length,
      teamsLedCount: user.teamLeadTeams.length,
      score: totalScore,
      globalRank,
      collegeRank,
      departmentRank,
    };
  }

  public static async getPersonalParticipationHistory(userId: string) {
    const participations = await prisma.participation.findMany({
      where: { userId },
      include: {
        event: { select: { id: true, title: true, startDate: true, endDate: true, mode: true } },
        team: { select: { id: true, name: true, scope: true } },
      },
      orderBy: { participatedAt: 'desc' },
    });

    return participations.map((p) => ({
      id: p.id,
      eventId: p.eventId,
      eventTitle: p.event.title,
      eventDate: p.event.startDate.toISOString(),
      teamId: p.teamId,
      teamName: p.team.name,
      result: p.result || 'PARTICIPATED',
      rank: p.rank || null,
      participatedAt: p.participatedAt.toISOString(),
    }));
  }

  public static async getPersonalParticipationOverTime(userId: string) {
    const participations = await prisma.participation.findMany({
      where: { userId },
      orderBy: { participatedAt: 'asc' },
    });

    const monthlyCounts: Record<string, number> = {};
    participations.forEach((p) => {
      const yearMonth = p.participatedAt.toISOString().slice(0, 7);
      monthlyCounts[yearMonth] = (monthlyCounts[yearMonth] || 0) + 1;
    });

    return Object.entries(monthlyCounts).map(([period, participations]) => ({
      period,
      participations,
    }));
  }

  public static async getPersonalWinsOverTime(userId: string) {
    const participations = await prisma.participation.findMany({
      where: {
        userId,
        result: { in: ['WINNER', 'WIN', 'RUNNER_UP', 'RUNNER-UP', 'FINALIST'] },
      },
      orderBy: { participatedAt: 'asc' },
    });

    const monthlyWins: Record<string, number> = {};
    participations.forEach((p) => {
      const yearMonth = p.participatedAt.toISOString().slice(0, 7);
      monthlyWins[yearMonth] = (monthlyWins[yearMonth] || 0) + 1;
    });

    return Object.entries(monthlyWins).map(([period, wins]) => ({
      period,
      wins,
    }));
  }

  public static async getCollegeAnalytics(collegeId: string) {
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: {
        location: true,
        departments: true,
        students: {
          include: {
            user: {
              include: {
                participations: true,
                teamLeadTeams: true,
                teamMemberships: true,
              },
            },
          },
        },
      },
    });

    if (!college) {
      const error: any = new Error('College not found.');
      error.statusCode = 404;
      error.code = 'COLLEGE_NOT_FOUND';
      throw error;
    }

    let totalStudents = college.students.length;
    let activeParticipants = 0;
    let totalEvents = 0;
    let totalWins = 0;
    let totalRunnerUps = 0;
    let totalFinalists = 0;
    let totalScore = 0;
    const teamSet = new Set<string>();

    college.students.forEach((sp) => {
      if (!sp.user) return;
      const pCount = sp.user.participations.length;
      if (pCount > 0) activeParticipants += 1;
      totalEvents += pCount;

      sp.user.teamMemberships.forEach((tm) => teamSet.add(tm.teamId));

      sp.user.participations.forEach((p) => {
        const res = p.result ? p.result.toUpperCase() : 'PARTICIPATED';
        if (res === 'WINNER' || res === 'WIN') {
          totalWins += 1;
          totalScore += DEFAULT_RANKING_WEIGHTS.winner;
        } else if (res === 'RUNNER_UP' || res === 'RUNNER-UP' || res === 'SECOND') {
          totalRunnerUps += 1;
          totalScore += DEFAULT_RANKING_WEIGHTS.runnerUp;
        } else if (res === 'FINALIST') {
          totalFinalists += 1;
          totalScore += DEFAULT_RANKING_WEIGHTS.finalist;
        } else {
          totalScore += DEFAULT_RANKING_WEIGHTS.participation;
        }
      });
    });

    const collegeRankings = await RankingService.getCollegeRankings({ limit: 10000 });
    const collegeRankEntry = collegeRankings.rankings.find((r) => r.collegeId === collegeId);
    const collegeRank = collegeRankEntry ? collegeRankEntry.rank : collegeRankings.rankings.length + 1;

    const avgStudentScore = totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;
    const completionRate = totalEvents > 0 ? Math.min(100, Math.round(((totalWins + totalRunnerUps + totalFinalists) / totalEvents) * 100)) : 0;
    const participationRate = totalStudents > 0 ? Math.round((activeParticipants / totalStudents) * 100) : 0;

    // Staff/Faculty members for this college
    const staffMembers = await prisma.user.findMany({
      where: {
        role: { in: ['PROFESSIONAL', 'COLLEGE_ADMIN'] },
        OR: [
          { professionalProfile: { company: { contains: college.name, mode: 'insensitive' } } },
          { email: { endsWith: college.emailDomain || 'undefined_domain' } },
        ],
      },
      select: { id: true, name: true, email: true, role: true, professionalProfile: true },
    });

    const staffIds = staffMembers.map((s) => s.id);

    // Staff Mentors acting for which teams
    const staffMentorships = await prisma.mentorship.findMany({
      where: {
        OR: [
          { mentorId: { in: staffIds.length > 0 ? staffIds : ['none'] } },
          { menteeTeam: { members: { some: { user: { studentProfile: { collegeId } } } } } },
        ],
        status: { in: ['ACCEPTED', 'ACTIVE', 'REQUESTED'] },
      },
      include: {
        mentor: {
          select: { id: true, name: true, email: true, professionalProfile: true },
        },
        menteeTeam: {
          include: {
            event: { select: { id: true, title: true } },
            teamLead: { select: { id: true, name: true } },
            members: { include: { user: { select: { id: true, name: true } } } },
          },
        },
      },
    });

    const staffMentorRoster = staffMentorships.map((m: any) => ({
      mentorshipId: m.id,
      staffName: m.mentor?.name || 'College Faculty Mentor',
      staffEmail: m.mentor?.email || 'faculty@college.edu',
      staffTitle: m.mentor?.professionalProfile?.jobTitle || 'Faculty Advisor & Mentor',
      teamId: m.menteeTeam?.id,
      teamName: m.menteeTeam?.name || 'Student Hackathon Team',
      eventTitle: m.menteeTeam?.event?.title || 'Global Hackathon',
      teamLeadName: m.menteeTeam?.teamLead?.name || 'Student Lead',
      membersCount: m.menteeTeam?.members?.length || 1,
      status: m.status,
    }));

    // Participation history of students from this college
    const collegeStudentIds = college.students.map((s) => s.userId).filter(Boolean);
    const participations = await prisma.participation.findMany({
      where: { userId: { in: collegeStudentIds } },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true, startDate: true } },
        team: { select: { id: true, name: true } },
      },
      orderBy: { participatedAt: 'desc' },
      take: 20,
    });

    const studentParticipationHistory = participations.map((p: any) => ({
      id: p.id,
      studentName: p.user?.name || 'Student',
      studentEmail: p.user?.email || 'student@college.edu',
      eventTitle: p.event?.title || 'Hackathon Competition',
      teamName: p.team?.name || 'College Team',
      result: p.result || 'PARTICIPATED',
      date: p.participatedAt.toISOString(),
    }));

    // Rankings of students across all students worldwide
    const studentGlobalRankings = await RankingService.getStudentRankings({ limit: 10000 });
    const collegeStudentRankings = studentGlobalRankings.rankings
      .filter((r) => r.college?.toLowerCase() === college.name.toLowerCase() || collegeStudentIds.includes(r.studentId))
      .map((r, idx) => ({
        studentId: r.studentId,
        studentName: r.name,
        globalRank: r.rank,
        collegeRank: idx + 1,
        score: r.score,
        wins: r.wins,
        department: r.department || 'General',
      }));

    return {
      collegeId: college.id,
      collegeName: college.name,
      emailDomain: college.emailDomain || null,
      location: college.location ? `${college.location.city}, ${college.location.state}` : null,
      collegeRank,
      totalCollegesCount: collegeRankings.rankings.length,
      totalStudents,
      totalStaff: staffMembers.length,
      activeParticipants,
      participationRate,
      totalEvents,
      totalTeams: teamSet.size,
      totalWins,
      totalRunnerUps,
      totalFinalists,
      totalScore,
      avgStudentScore,
      completionRate,
      staffMembers: staffMembers.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        role: s.role,
        jobTitle: s.professionalProfile?.jobTitle || 'Faculty Member',
      })),
      staffMentorRoster,
      studentParticipationHistory,
      collegeStudentRankings: collegeStudentRankings.slice(0, 10),
    };
  }

  public static async getCollegeMentorshipAnalytics(collegeId: string) {
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return {
        activeMentors: 0,
        studentsMentored: 0,
        activeMentorships: 0,
        completedMentorships: 0,
        byDepartment: [],
      };
    }

    const mentorships = await prisma.mentorship.findMany({
      where: {
        OR: [
          { menteeTeam: { members: { some: { user: { studentProfile: { collegeId } } } } } },
          { mentor: { professionalProfile: { company: { contains: college.name, mode: 'insensitive' } } } },
        ],
      },
      include: {
        mentor: true,
        menteeTeam: {
          include: {
            members: {
              include: {
                user: {
                  include: {
                    studentProfile: {
                      include: { department: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const activeMentorshipsCount = mentorships.filter((m) => m.status === 'ACCEPTED' || m.status === 'ACTIVE').length;
    const completedMentorshipsCount = mentorships.filter((m) => m.status === 'COMPLETED').length;

    const uniqueMentorIds = new Set<string>();
    const uniqueMenteeUserIds = new Set<string>();
    const deptMenteeMap: Record<string, Set<string>> = {};

    mentorships.forEach((m) => {
      if (m.mentorId) uniqueMentorIds.add(m.mentorId);
      if (m.menteeTeam) {
        m.menteeTeam.members.forEach((mem) => {
          uniqueMenteeUserIds.add(mem.userId);
          const deptName = mem.user.studentProfile?.department?.name || 'General';
          if (!deptMenteeMap[deptName]) {
            deptMenteeMap[deptName] = new Set<string>();
          }
          deptMenteeMap[deptName].add(mem.userId);
        });
      }
    });

    const byDepartment = Object.keys(deptMenteeMap).map((dept) => ({
      department: dept,
      studentsCount: deptMenteeMap[dept].size,
    }));

    return {
      activeMentors: uniqueMentorIds.size,
      studentsMentored: uniqueMenteeUserIds.size,
      activeMentorships: activeMentorshipsCount,
      completedMentorships: completedMentorshipsCount,
      byDepartment,
    };
  }

  public static async getCollegeStudents(collegeId: string, queryParams: any) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 20;
    const search = queryParams.search || '';
    const departmentId = queryParams.departmentId || null;
    const skip = (page - 1) * limit;

    const where: any = {
      role: 'STUDENT',
      studentProfile: {
        collegeId,
        ...(departmentId ? { departmentId } : {}),
      },
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          studentProfile: {
            include: {
              department: { select: { id: true, name: true } },
            },
          },
          participations: true,
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const formatted = students.map((s) => {
      let wins = 0;
      let totalScore = 0;
      s.participations.forEach((p) => {
        const res = p.result ? p.result.toUpperCase() : 'PARTICIPATED';
        if (res === 'WINNER' || res === 'WIN') {
          wins += 1;
          totalScore += DEFAULT_RANKING_WEIGHTS.winner;
        } else {
          totalScore += DEFAULT_RANKING_WEIGHTS.participation;
        }
      });

      return {
        studentId: s.id,
        name: s.name,
        email: s.email,
        department: s.studentProfile?.department?.name || 'N/A',
        yearOfStudy: s.studentProfile?.yearOfStudy || 1,
        participationsCount: s.participations.length,
        wins,
        score: totalScore,
      };
    });

    return {
      students: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async getCollegeStudentDetail(collegeId: string, studentId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: studentId,
        studentProfile: { collegeId },
      },
      include: {
        studentProfile: {
          include: {
            department: { select: { id: true, name: true } },
            college: { select: { id: true, name: true } },
          },
        },
        participations: {
          include: {
            event: { select: { id: true, title: true, startDate: true } },
            team: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!user) {
      const error: any = new Error('Student not found in this institution.');
      error.statusCode = 404;
      error.code = 'STUDENT_NOT_FOUND';
      throw error;
    }

    return {
      studentId: user.id,
      name: user.name,
      email: user.email,
      department: user.studentProfile?.department?.name || 'N/A',
      yearOfStudy: user.studentProfile?.yearOfStudy || 1,
      participations: user.participations.map((p) => ({
        id: p.id,
        eventTitle: p.event.title,
        teamName: p.team.name,
        result: p.result || 'PARTICIPATED',
        participatedAt: p.participatedAt.toISOString(),
      })),
    };
  }

  public static async getCollegeDepartmentAnalytics(collegeId: string) {
    const departments = await prisma.department.findMany({
      where: { collegeId },
      include: {
        students: {
          include: {
            user: {
              include: {
                participations: true,
                teamMemberships: true,
              },
            },
          },
        },
      },
    });

    const deptAnalytics = departments.map((d) => {
      let totalStudents = d.students.length;
      let participantsCount = 0;
      let totalWins = 0;
      let totalFinalists = 0;
      let totalScore = 0;

      d.students.forEach((sp) => {
        if (!sp.user) return;
        if (sp.user.participations.length > 0) participantsCount += 1;

        sp.user.participations.forEach((p) => {
          const res = p.result ? p.result.toUpperCase() : 'PARTICIPATED';
          if (res === 'WINNER' || res === 'WIN') {
            totalWins += 1;
            totalScore += DEFAULT_RANKING_WEIGHTS.winner;
          } else if (res === 'FINALIST') {
            totalFinalists += 1;
            totalScore += DEFAULT_RANKING_WEIGHTS.finalist;
          } else {
            totalScore += DEFAULT_RANKING_WEIGHTS.participation;
          }
        });
      });

      const avgScore = totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;

      return {
        departmentId: d.id,
        departmentName: d.name,
        totalStudents,
        participantsCount,
        totalWins,
        totalFinalists,
        avgScore,
      };
    });

    return deptAnalytics;
  }

  public static async getCollegeEventAnalytics(collegeId: string) {
    const participations = await prisma.participation.findMany({
      where: {
        user: {
          studentProfile: { collegeId },
        },
      },
      include: {
        event: { select: { id: true, title: true, startDate: true, status: true, mode: true } },
        team: { select: { id: true, name: true } },
      },
    });

    const eventMap: Record<string, any> = {};
    participations.forEach((p) => {
      if (!eventMap[p.eventId]) {
        eventMap[p.eventId] = {
          eventId: p.eventId,
          eventTitle: p.event.title,
          startDate: p.event.startDate.toISOString(),
          status: p.event.status,
          mode: p.event.mode,
          participantsCount: 0,
          teamsSet: new Set<string>(),
          wins: 0,
          finalists: 0,
        };
      }

      eventMap[p.eventId].participantsCount += 1;
      eventMap[p.eventId].teamsSet.add(p.teamId);
      const res = p.result ? p.result.toUpperCase() : 'PARTICIPATED';
      if (res === 'WINNER' || res === 'WIN') eventMap[p.eventId].wins += 1;
      if (res === 'FINALIST') eventMap[p.eventId].finalists += 1;
    });

    return Object.values(eventMap).map((e: any) => ({
      eventId: e.eventId,
      eventTitle: e.eventTitle,
      startDate: e.startDate,
      status: e.status,
      mode: e.mode,
      participantsCount: e.participantsCount,
      teamsCount: e.teamsSet.size,
      wins: e.wins,
      finalists: e.finalists,
    }));
  }

  public static async getCollegeTeamAnalytics(collegeId: string) {
    const members = await prisma.teamMember.findMany({
      where: {
        user: {
          studentProfile: { collegeId },
        },
      },
      include: {
        team: {
          include: {
            event: { select: { id: true, title: true } },
            members: {
              include: {
                user: {
                  include: {
                    studentProfile: { select: { collegeId: true, departmentId: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    const teamMap: Record<string, any> = {};
    let crossDepartmentTeamsCount = 0;
    let crossCollegeTeamsCount = 0;

    members.forEach((m) => {
      const t = m.team;
      if (!teamMap[t.id]) {
        teamMap[t.id] = {
          teamId: t.id,
          teamName: t.name,
          eventTitle: t.event.title,
          membersCount: t.members.length,
          status: t.status,
        };

        const deptSet = new Set<string>();
        const collegeSet = new Set<string>();
        t.members.forEach((mem) => {
          if (mem.user.studentProfile?.departmentId) deptSet.add(mem.user.studentProfile.departmentId);
          if (mem.user.studentProfile?.collegeId) collegeSet.add(mem.user.studentProfile.collegeId);
        });

        if (deptSet.size > 1) crossDepartmentTeamsCount += 1;
        if (collegeSet.size > 1) crossCollegeTeamsCount += 1;
      }
    });

    return {
      totalCollegeTeams: Object.keys(teamMap).length,
      crossDepartmentTeamsCount,
      crossCollegeTeamsCount,
      teams: Object.values(teamMap),
    };
  }

  public static async getAdminPlatformAnalytics() {
    const [totalUsers, studentCount, professionalCount, collegeCount, eventCount, teamCount, participationCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'PROFESSIONAL' } }),
      prisma.college.count(),
      prisma.event.count(),
      prisma.team.count(),
      prisma.participation.count(),
    ]);

    const winCount = await prisma.participation.count({
      where: { result: { in: ['WINNER', 'WIN'] } },
    });

    return {
      totalUsers,
      students: studentCount,
      professionals: professionalCount,
      colleges: collegeCount,
      events: eventCount,
      teams: teamCount,
      participations: participationCount,
      wins: winCount,
    };
  }

  public static async addCollegeStudent(collegeId: string, data: { name: string; email: string; password?: string; department?: string; yearOfStudy?: number }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      const error: any = new Error('A user with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password || 'password123', salt);

    let dept = await prisma.department.findFirst({
      where: {
        collegeId,
        name: { equals: data.department || 'Computer Science', mode: 'insensitive' },
      },
    });

    if (!dept) {
      dept = await prisma.department.create({
        data: {
          collegeId,
          name: data.department || 'Computer Science',
        },
      });
    }

    const newUser = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: 'STUDENT',
          isVerified: true,
        },
      });

      await tx.studentProfile.create({
        data: {
          userId: u.id,
          collegeId,
          departmentId: dept.id,
          yearOfStudy: Number(data.yearOfStudy) || 1,
        },
      });

      await tx.notificationPreference.create({ data: { userId: u.id } });
      return u;
    });

    return {
      studentId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      department: dept.name,
      yearOfStudy: Number(data.yearOfStudy) || 1,
      participationsCount: 0,
      wins: 0,
      score: 0,
    };
  }

  public static async deleteCollegeStudent(collegeId: string, studentId: string) {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: { studentProfile: true },
    });

    if (!student || student.studentProfile?.collegeId !== collegeId) {
      const error: any = new Error('Student not found in this institution.');
      error.statusCode = 404;
      throw error;
    }

    await prisma.user.delete({ where: { id: studentId } });
    return { success: true };
  }

  public static async getCollegeStaff(collegeId: string) {
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      const error: any = new Error('College not found.');
      error.statusCode = 404;
      throw error;
    }

    const staff = await prisma.user.findMany({
      where: {
        role: { in: ['PROFESSIONAL', 'COLLEGE_ADMIN'] },
        OR: [
          { professionalProfile: { company: { contains: college.name, mode: 'insensitive' } } },
          { email: { endsWith: college.emailDomain || 'undefined_domain' } },
          { id: college.id },
          { studentProfile: { collegeId } },
        ],
      },
      include: { professionalProfile: true },
    });

    return staff.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      role: s.role,
      jobTitle: s.professionalProfile?.jobTitle || 'Faculty Member',
      company: s.professionalProfile?.company || college.name,
    }));
  }

  public static async addCollegeStaff(collegeId: string, data: { name: string; email: string; password?: string; jobTitle?: string }) {
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      const error: any = new Error('College not found.');
      error.statusCode = 404;
      throw error;
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      const error: any = new Error('A user with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password || 'password123', salt);

    const newUser = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: 'PROFESSIONAL',
          isVerified: true,
        },
      });

      await tx.professionalProfile.create({
        data: {
          userId: u.id,
          company: college.name,
          jobTitle: data.jobTitle || 'Faculty Member',
          verificationStatus: 'VERIFIED',
        },
      });

      await tx.notificationPreference.create({ data: { userId: u.id } });
      return u;
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      jobTitle: data.jobTitle || 'Faculty Member',
      company: college.name,
    };
  }

  public static async deleteCollegeStaff(collegeId: string, staffId: string) {
    const staff = await prisma.user.findUnique({
      where: { id: staffId },
      include: { professionalProfile: true },
    });

    if (!staff) {
      const error: any = new Error('Staff member not found.');
      error.statusCode = 404;
      throw error;
    }

    await prisma.user.delete({ where: { id: staffId } });
    return { success: true };
  }

  public static async updateCollegeStaff(collegeId: string, staffId: string, data: { name?: string; email?: string; jobTitle?: string; password?: string }) {
    const staff = await prisma.user.findUnique({
      where: { id: staffId },
      include: { professionalProfile: true },
    });

    if (!staff) {
      const error: any = new Error('Staff member not found.');
      error.statusCode = 404;
      throw error;
    }

    let passwordHash = undefined;
    if (data.password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(data.password, salt);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: staffId },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.email ? { email: data.email } : {}),
          ...(passwordHash ? { passwordHash } : {}),
        },
      });

      if (staff.professionalProfile && data.jobTitle) {
        await tx.professionalProfile.update({
          where: { id: staff.professionalProfile.id },
          data: { jobTitle: data.jobTitle },
        });
      }

      return u;
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      jobTitle: data.jobTitle || staff.professionalProfile?.jobTitle || 'Faculty Member',
    };
  }
}

import { prisma } from '../config/database';

export class AdminService {
  public static async getPlatformAnalytics() {
    const [
      totalUsers,
      studentCount,
      professionalCount,
      collegeAdminCount,
      adminCount,
      activeUsersCount,
      collegeCount,
      teamCount,
      eventCount,
      participationCount,
      mentorshipCount,
      totalReports,
      pendingReports,
      confirmedReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'PROFESSIONAL' } }),
      prisma.user.count({ where: { role: 'COLLEGE_ADMIN' } }),
      prisma.user.count({ where: { role: 'PLATFORM_ADMIN' } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.college.count(),
      prisma.team.count(),
      prisma.event.count(),
      prisma.participation.count(),
      prisma.mentorship.count(),
      prisma.report.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { resolution: 'CONFIRMED' } }),
    ]);

    // Aggregate skill distribution from database
    const skills = await prisma.userSkill.groupBy({
      by: ['skillId'],
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 10,
    });

    const skillIds = skills.map((s) => s.skillId);
    const skillRecords = await prisma.skill.findMany({
      where: { id: { in: skillIds } },
    });

    const skillDistribution = skills.map((s) => {
      const rec = skillRecords.find((r) => r.id === s.skillId);
      return {
        skill: rec?.name || 'Unknown',
        usersCount: s._count.userId,
      };
    });

    return {
      users: {
        totalUsers,
        activeUsers: activeUsersCount,
        students: studentCount,
        professionals: professionalCount,
        collegeAdmins: collegeAdminCount,
        platformAdmins: adminCount,
      },
      colleges: {
        totalColleges: collegeCount,
      },
      teams: {
        totalTeams: teamCount,
      },
      events: {
        totalEvents: eventCount,
        totalParticipations: participationCount,
      },
      reports: {
        totalReports,
        pendingReports,
        confirmedReports,
      },
      mentorship: {
        totalMentorships: mentorshipCount,
      },
      skillDistribution,
    };
  }

  public static async getAdminUsers(queryParams: any) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 20;
    const search = queryParams.search || '';
    const role = queryParams.role || null;
    const status = queryParams.status || null;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(role && role !== 'ALL' ? { role } : {}),
      ...(status === 'ACTIVE' ? { isActive: true } : status === 'DEACTIVATED' || status === 'SUSPENDED' ? { isActive: false } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          studentProfile: {
            include: {
              college: { select: { name: true } },
              department: { select: { name: true } },
            },
          },
          professionalProfile: {
            select: { company: true, jobTitle: true },
          },
          _count: {
            select: {
              participations: true,
              reportsReceived: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    const formatted = users.map((u) => ({
      userId: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      status: u.isActive ? 'ACTIVE' : 'SUSPENDED',
      college: u.studentProfile?.college?.name || null,
      department: u.studentProfile?.department?.name || null,
      organization: u.professionalProfile?.company || null,
      jobTitle: u.professionalProfile?.jobTitle || null,
      eventsParticipated: u._count.participations,
      reportsCount: u._count.reportsReceived,
      createdAt: u.createdAt.toISOString(),
    }));

    return {
      users: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async updateUserStatus(adminId: string, userId: string, status: string, reason?: string) {
    const isActive = status.toUpperCase() === 'ACTIVE';

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    // Record audit log entry
    await prisma.auditLog.create({
      data: {
        adminId,
        action: isActive ? 'USER_RESTORED' : 'USER_DEACTIVATED',
        targetType: 'USER',
        targetId: userId,
        reason: reason || `Account status updated to ${status}`,
      },
    });

    return {
      userId: user.id,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      status: user.isActive ? 'ACTIVE' : 'SUSPENDED',
    };
  }

  public static async getAdminColleges(queryParams: any) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 20;
    const search = queryParams.search || '';
    const skip = (page - 1) * limit;

    const where: any = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { emailDomain: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        include: {
          location: true,
          _count: {
            select: { students: true },
          },
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.college.count({ where }),
    ]);

    const formatted = colleges.map((c) => ({
      collegeId: c.id,
      collegeName: c.name,
      location: c.location ? `${c.location.city}, ${c.location.state}` : 'Registered Campus',
      emailDomain: c.emailDomain,
      isVerified: c.isVerified,
      totalStudents: c._count.students,
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

  public static async getAdminAuditLogs(queryParams: any) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        include: {
          admin: { select: { id: true, name: true, email: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count(),
    ]);

    const formatted = logs.map((l: any) => ({
      id: l.id,
      adminId: l.adminId,
      adminName: l.admin.name,
      adminEmail: l.admin.email,
      action: l.action,
      targetType: l.targetType,
      targetId: l.targetId,
      reason: l.reason,
      createdAt: l.createdAt.toISOString(),
    }));

    return {
      auditLogs: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async getPlatformSettings() {
    return {
      reportAccountThreshold: 30,
      rankingWeights: {
        winner: 50,
        runnerUp: 35,
        finalist: 25,
        participation: 15,
        leadership: 5,
      },
      defaultMaxTeamSize: 4,
      allowCrossCollegeTeams: true,
    };
  }

  public static async getAdminUserDetail(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            college: { select: { name: true } },
            department: { select: { name: true } },
          },
        },
        professionalProfile: {
          select: { company: true, jobTitle: true },
        },
        _count: {
          select: {
            participations: true,
            reportsReceived: true,
          },
        },
      },
    });

    if (!user) {
      const error: any = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    return {
      userId: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      status: user.isActive ? 'ACTIVE' : 'SUSPENDED',
      college: user.studentProfile?.college?.name || null,
      department: user.studentProfile?.department?.name || null,
      organization: user.professionalProfile?.company || null,
      jobTitle: user.professionalProfile?.jobTitle || null,
      eventsParticipated: user._count.participations,
      reportsCount: user._count.reportsReceived,
      createdAt: user.createdAt.toISOString(),
    };
  }

  public static async getAdminTeams(queryParams: any) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 20;
    const search = queryParams.search || '';
    const skip = (page - 1) * limit;

    const where: any = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          event: { select: { title: true } },
          teamLead: { select: { name: true } },
          _count: { select: { members: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.team.count({ where }),
    ]);

    const formatted = teams.map((t) => ({
      id: t.id,
      name: t.name,
      teamName: t.name,
      eventName: t.event.title,
      teamLeadName: t.teamLead.name,
      membersCount: t._count.members,
      institutionsCount: 1,
      status: t.status,
      reportsCount: 0,
      createdDate: t.createdAt.toISOString(),
    }));

    return {
      teams: formatted,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  public static async getAdminTeamDetail(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        event: { select: { title: true } },
        teamLead: { select: { name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    if (!team) {
      const error: any = new Error('Team not found.');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: team.id,
      name: team.name,
      eventName: team.event.title,
      teamLeadName: team.teamLead.name,
      membersCount: team.members.length,
      members: team.members.map((m) => ({ id: m.user.id, name: m.user.name, email: m.user.email, role: m.role })),
      status: team.status,
      createdAt: team.createdAt.toISOString(),
    };
  }

  public static async getAdminEvents(queryParams: any) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 20;
    const search = queryParams.search || '';
    const skip = (page - 1) * limit;

    const where: any = search
      ? { title: { contains: search, mode: 'insensitive' } }
      : {};

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          creator: { select: { name: true } },
          _count: { select: { teams: true, participations: true } },
        },
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
      }),
      prisma.event.count({ where }),
    ]);

    const formatted = events.map((e) => ({
      id: e.id,
      title: e.title,
      organizer: e.creator?.name || 'Platform',
      date: e.startDate.toISOString().split('T')[0],
      participantsCount: e._count.participations,
      teamsCount: e._count.teams,
      status: e.status,
      reportsCount: 0,
    }));

    return {
      events: formatted,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  public static async getAdminEventDetail(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        creator: { select: { name: true, email: true } },
        _count: { select: { teams: true, participations: true } },
      },
    });

    if (!event) {
      const error: any = new Error('Event not found.');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      organizer: event.creator?.name || 'Platform',
      date: event.startDate.toISOString().split('T')[0],
      participantsCount: event._count.participations,
      teamsCount: event._count.teams,
      status: event.status,
    };
  }

  public static async createAdminUser(data: any) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      const error: any = new Error('A user with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password || 'password123', salt);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || 'STUDENT',
        isVerified: true,
      },
    });

    return user;
  }

  public static async updateAdminUser(userId: string, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.email ? { email: data.email } : {}),
        ...(data.role ? { role: data.role } : {}),
        ...(data.isActive !== undefined ? { isActive: Boolean(data.isActive) } : {}),
      },
    });
    return user;
  }

  public static async createAdminCollege(data: any) {
    let locationId: string | undefined;
    if (data.city && data.state && data.country) {
      const loc = await prisma.location.create({
        data: { latitude: 0, longitude: 0, city: data.city, state: data.state, country: data.country },
      });
      locationId = loc.id;
    }

    const college = await prisma.college.create({
      data: {
        name: data.name || data.institutionName,
        isVerified: true,
        ...(locationId ? { locationId } : {}),
      },
    });
    return college;
  }

  public static async updateAdminCollege(collegeId: string, data: any) {
    const college = await prisma.college.update({
      where: { id: collegeId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.isVerified !== undefined ? { isVerified: Boolean(data.isVerified) } : {}),
      },
    });
    return college;
  }

  public static async deleteAdminCollege(collegeId: string) {
    // 1. Delete student profiles associated with this college
    await prisma.studentProfile.deleteMany({
      where: { collegeId },
    });

    // 2. Delete rankings for this college
    await prisma.ranking.deleteMany({
      where: { collegeId },
    });

    // 3. Delete departments for this college
    await prisma.department.deleteMany({
      where: { collegeId },
    });

    // 4. Delete the college record
    await prisma.college.delete({
      where: { id: collegeId },
    });

    return { success: true };
  }

  public static async createAdminEvent(creatorId: string, data: any) {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description || 'Administrative Hackathon Event',
        organizer: data.organizer || 'Platform Admin',
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : new Date(Date.now() + 7 * 86400000),
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : new Date(Date.now() + 5 * 86400000),
        status: (data.status as any) || 'ACTIVE',
        ...(creatorId ? { creator: { connect: { id: creatorId } } } : {}),
      },
    });
    return event;
  }

  public static async updateAdminEvent(eventId: string, data: any) {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.status ? { status: data.status } : {}),
      },
    });
    return event;
  }

  public static async deleteAdminEvent(eventId: string) {
    await prisma.participation.deleteMany({ where: { eventId } });
    await prisma.team.deleteMany({ where: { eventId } });
    await prisma.event.delete({ where: { id: eventId } });
    return { success: true };
  }

  public static async updateAdminTeam(teamId: string, data: any) {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.status ? { status: data.status } : {}),
      },
    });
    return team;
  }

  public static async deleteAdminTeam(teamId: string) {
    await prisma.teamMember.deleteMany({ where: { teamId } });
    await prisma.teamInvitation.deleteMany({ where: { teamId } });
    await prisma.team.delete({ where: { id: teamId } });
    return { success: true };
  }

  public static async verifyAdminCollege(collegeId: string, status: string, notes?: string) {
    const isVerified = status.toUpperCase() === 'VERIFIED';
    const college = await prisma.college.update({
      where: { id: collegeId },
      data: { isVerified },
    });
    return college;
  }

  public static async getSystemHealth() {
    let dbStatus = 'CONNECTED';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'DISCONNECTED';
    }

    return {
      apiStatus: 'HEALTHY',
      databaseStatus: dbStatus,
      githubApiStatus: 'CONNECTED',
      notificationServiceStatus: 'HEALTHY',
      timestamp: new Date().toISOString(),
    };
  }
}

import { prisma } from '../config/database';
import { NotificationService } from './notification.service';

export class TeamService {
  public static async createTeam(
    creatorId: string,
    data: {
      name: string;
      description?: string;
      eventId?: string;
      maxMembers?: number;
      maximumMembers?: number;
      scope?: string;
      requiredSkills?: any;
    }
  ) {
    let event = data.eventId ? await prisma.event.findUnique({ where: { id: data.eventId } }) : null;
    if (!event) {
      event = await prisma.event.findFirst();
    }
    if (!event) {
      event = await prisma.event.create({
        data: {
          id: 'evt_global_ai',
          title: 'Global AI & Web Innovation Hackathon 2026',
          description: 'Building next-generation intelligent applications for real-world impact.',
          organizer: 'TeamSync Global Platform',
          mode: 'HYBRID',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 86400000),
          registrationDeadline: new Date(Date.now() + 5 * 86400000),
          minTeamSize: 2,
          maxTeamSize: 5,
          status: 'UPCOMING',
        },
      });
    }

    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
      include: { studentProfile: true, professionalProfile: true },
    });

    if (!creator) {
      const error: any = new Error('User not found.');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const skillsStr = Array.isArray(data.requiredSkills)
      ? data.requiredSkills.join(', ')
      : typeof data.requiredSkills === 'string'
      ? data.requiredSkills
      : null;

    const teamScope = data.scope || 'ALL_COLLEGES';
    const capacity = data.maximumMembers || data.maxMembers || event.maxTeamSize || 4;
    const poster = (data as any).posterUrl || (data as any).githubRepoUrl || null;

    return prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: data.name,
          description: data.description || null,
          eventId: event.id,
          teamLeadId: creatorId,
          maxMembers: capacity,
          recruitmentOpen: true,
          scope: teamScope,
          requiredSkills: skillsStr,
          githubRepoUrl: poster,
          status: 'RECRUITING',
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: creatorId,
          role: 'LEAD',
          status: 'ACTIVE',
        },
      });

      return team;
    });
  }

  public static async getTeams(queryParams: any) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 12;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(queryParams.eventId ? { eventId: queryParams.eventId } : {}),
      ...(queryParams.recruitmentOpen !== undefined ? { recruitmentOpen: queryParams.recruitmentOpen } : {}),
      ...(queryParams.scope === 'GLOBAL' || queryParams.scope === 'ALL_COLLEGES'
        ? { scope: { in: ['GLOBAL', 'ALL_COLLEGES', 'GLOBAL_EVENT'] } }
        : queryParams.scope === 'MY_COLLEGE' || queryParams.scope === 'COLLEGE'
        ? {
            scope: { in: ['MY_COLLEGE', 'COLLEGE'] },
            ...(queryParams.collegeId
              ? { teamLead: { studentProfile: { collegeId: queryParams.collegeId } } }
              : queryParams.collegeName
              ? { teamLead: { studentProfile: { college: { name: { contains: queryParams.collegeName, mode: 'insensitive' } } } } }
              : {}),
          }
        : queryParams.scope === 'MY_DEPARTMENT' || queryParams.scope === 'DEPARTMENT'
        ? {
            scope: { in: ['MY_DEPARTMENT', 'DEPARTMENT'] },
            ...(queryParams.departmentId
              ? { teamLead: { studentProfile: { departmentId: queryParams.departmentId } } }
              : queryParams.departmentName
              ? { teamLead: { studentProfile: { department: { name: { contains: queryParams.departmentName, mode: 'insensitive' } } } } }
              : {}),
          }
        : queryParams.scope
        ? { scope: queryParams.scope }
        : {}),
      ...(queryParams.search
        ? {
            OR: [
              { name: { contains: queryParams.search, mode: 'insensitive' } },
              { description: { contains: queryParams.search, mode: 'insensitive' } },
              { requiredSkills: { contains: queryParams.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          event: { select: { id: true, title: true } },
          teamLead: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              studentProfile: { include: { college: true } },
              professionalProfile: true,
            },
          },
          members: { where: { status: 'ACTIVE' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.team.count({ where }),
    ]);

    const formatted = teams.map((team) => {
      const activeMembersCount = team.members.length;
      let userJoinState: 'CAN_REQUEST' | 'ALREADY_MEMBER' | 'REQUEST_PENDING' | 'TEAM_FULL' | 'RECRUITMENT_CLOSED' = 'CAN_REQUEST';

      if (!team.recruitmentOpen) userJoinState = 'RECRUITMENT_CLOSED';
      else if (activeMembersCount >= team.maxMembers) userJoinState = 'TEAM_FULL';

      if (queryParams.currentUserId) {
        const isMember = team.members.some((m) => m.userId === queryParams.currentUserId);
        if (isMember) userJoinState = 'ALREADY_MEMBER';
      }

      return {
        id: team.id,
        name: team.name,
        description: team.description,
        posterUrl: team.githubRepoUrl || null,
        eventId: team.eventId,
        eventName: team.event.title,
        teamLead: {
          id: team.teamLead.id,
          name: team.teamLead.name,
          profileImage: team.teamLead.profileImage,
          collegeName: team.teamLead.studentProfile?.college?.name || team.teamLead.professionalProfile?.company || 'TeamSync Member',
        },
        currentMembersCount: activeMembersCount,
        maxMembers: team.maxMembers,
        recruitmentOpen: team.recruitmentOpen && activeMembersCount < team.maxMembers,
        scope: team.scope,
        status: team.status,
        userJoinState,
        members: team.members.map((m) => ({
          id: m.userId,
          role: m.role,
        })),
        createdAt: team.createdAt.toISOString(),
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

  public static async getTeamById(teamId: string, currentUserId?: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        event: true,
        teamLead: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            studentProfile: { include: { college: true, department: true } },
            professionalProfile: true,
          },
        },
        members: {
          where: { status: 'ACTIVE' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
                role: true,
                studentProfile: { include: { college: true, department: true } },
                skills: { include: { skill: true } },
              },
            },
          },
        },
        joinRequests: {
          where: { status: 'PENDING' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
                studentProfile: { include: { college: true, department: true } },
                skills: { include: { skill: true } },
              },
            },
          },
        },
      },
    });

    if (!team) {
      const error: any = new Error('Team not found.');
      error.statusCode = 404;
      error.code = 'TEAM_NOT_FOUND';
      throw error;
    }

    const activeMembersCount = team.members.length;
    let userJoinState: 'CAN_REQUEST' | 'ALREADY_MEMBER' | 'REQUEST_PENDING' | 'TEAM_FULL' | 'RECRUITMENT_CLOSED' = 'CAN_REQUEST';
    let userRequestStatus: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED' = 'NONE';

    if (!team.recruitmentOpen) userJoinState = 'RECRUITMENT_CLOSED';
    else if (activeMembersCount >= team.maxMembers) userJoinState = 'TEAM_FULL';

    if (currentUserId) {
      const isMember = team.members.some((m) => m.userId === currentUserId);
      if (isMember) {
        userJoinState = 'ALREADY_MEMBER';
      } else {
        const req = team.joinRequests.find((r) => r.userId === currentUserId);
        if (req) {
          userJoinState = 'REQUEST_PENDING';
          userRequestStatus = req.status as any;
        }
      }
    }

    const isCurrentUserLead = currentUserId === team.teamLeadId;

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      eventId: team.eventId,
      eventName: team.event.title,
      isCurrentUserLead,
      isCurrentUserMember: team.members.some((m) => m.userId === currentUserId),
      teamLead: {
        id: team.teamLead.id,
        name: team.teamLead.name,
        profileImage: team.teamLead.profileImage,
        college: team.teamLead.studentProfile?.college?.name || team.teamLead.professionalProfile?.company || 'TeamSync Member',
      },
      currentMembersCount: activeMembersCount,
      maxMembers: team.maxMembers,
      recruitmentOpen: team.recruitmentOpen && activeMembersCount < team.maxMembers,
      scope: team.scope,
      status: team.status,
      userJoinState,
      userRequestStatus,
      requiredSkills: team.requiredSkills ? team.requiredSkills.split(',').map((s) => s.trim()) : [],
      members: team.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        role: m.role,
        profileImage: m.user.profileImage,
        college: m.user.studentProfile?.college?.name || 'Institution',
        department: m.user.studentProfile?.department?.name || 'Department',
        skills: m.user.skills.map((us) => us.skill.name),
      })),
      pendingRequestsCount: team.joinRequests.length,
      createdAt: team.createdAt.toISOString(),
    };
  }

  public static async createJoinRequest(teamId: string, userId: string, message?: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: { where: { status: 'ACTIVE' } },
        event: true,
        teamLead: true,
      },
    });

    if (!team) {
      const error: any = new Error('Team not found.');
      error.statusCode = 404;
      error.code = 'TEAM_NOT_FOUND';
      throw error;
    }

    if (!team.recruitmentOpen) {
      const error: any = new Error('Recruitment for this team is currently closed.');
      error.statusCode = 400;
      error.code = 'RECRUITMENT_CLOSED';
      throw error;
    }

    if (team.members.length >= team.maxMembers) {
      const error: any = new Error('Team has already reached maximum member capacity.');
      error.statusCode = 400;
      error.code = 'TEAM_FULL';
      throw error;
    }

    const isMember = team.members.some((m) => m.userId === userId);
    if (isMember) {
      const error: any = new Error('You are already an active member of this team.');
      error.statusCode = 400;
      error.code = 'ALREADY_MEMBER';
      throw error;
    }

    const existingRequest = await prisma.teamJoinRequest.findFirst({
      where: { teamId, userId, status: 'PENDING' },
    });

    if (existingRequest) {
      const error: any = new Error('You already have a pending join request for this team.');
      error.statusCode = 400;
      error.code = 'DUPLICATE_REQUEST';
      throw error;
    }

    const requester = await prisma.user.findUnique({ where: { id: userId } });

    const joinRequest = await prisma.teamJoinRequest.create({
      data: {
        teamId,
        userId,
        message: message || null,
        status: 'PENDING',
      },
    });

    // Automated Notification to Team Lead
    await NotificationService.createNotification({
      recipientId: team.teamLeadId,
      type: 'JOIN_REQUEST_RECEIVED',
      title: 'New Team Join Request',
      message: `${requester?.name || 'A developer'} requested to join your team "${team.name}".`,
      entityType: 'TEAM',
      entityId: team.id,
    });

    return {
      id: joinRequest.id,
      teamId: joinRequest.teamId,
      status: joinRequest.status,
      message: joinRequest.message,
      createdAt: joinRequest.createdAt.toISOString(),
    };
  }

  public static async acceptJoinRequest(requestId: string, leadUserId: string) {
    return prisma.$transaction(async (tx) => {
      const request = await tx.teamJoinRequest.findUnique({
        where: { id: requestId },
        include: {
          team: {
            include: {
              members: { where: { status: 'ACTIVE' } },
            },
          },
        },
      });

      if (!request || request.status !== 'PENDING') {
        const error: any = new Error('Valid pending join request not found.');
        error.statusCode = 404;
        error.code = 'REQUEST_NOT_FOUND';
        throw error;
      }

      if (request.team.teamLeadId !== leadUserId) {
        const error: any = new Error('Only the team lead can accept join requests.');
        error.statusCode = 403;
        error.code = 'UNAUTHORIZED';
        throw error;
      }

      if (request.team.members.length >= request.team.maxMembers) {
        const error: any = new Error('Team capacity reached. Cannot accept more members.');
        error.statusCode = 400;
        error.code = 'TEAM_FULL';
        throw error;
      }

      // Add user to team members
      await tx.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: request.teamId,
            userId: request.userId,
          },
        },
        update: { status: 'ACTIVE', role: 'MEMBER' },
        create: {
          teamId: request.teamId,
          userId: request.userId,
          role: 'MEMBER',
          status: 'ACTIVE',
        },
      });

      // Update request status
      await tx.teamJoinRequest.update({
        where: { id: requestId },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
          respondedBy: leadUserId,
        },
      });

      // Auto-close recruitment if team becomes full
      if (request.team.members.length + 1 >= request.team.maxMembers) {
        await tx.team.update({
          where: { id: request.teamId },
          data: { recruitmentOpen: false, status: 'FULL' },
        });
      }

      // Notification to Requester
      await tx.notification.create({
        data: {
          recipientId: request.userId,
          type: 'JOIN_REQUEST_ACCEPTED',
          title: 'Join Request Accepted!',
          message: `Your request to join "${request.team.name}" has been accepted!`,
          entityType: 'TEAM',
          entityId: request.teamId,
          isRead: false,
        },
      });

      return { message: 'Join request accepted successfully.' };
    });
  }

  public static async rejectJoinRequest(requestId: string, leadUserId: string) {
    const request = await prisma.teamJoinRequest.findUnique({
      where: { id: requestId },
      include: { team: true },
    });

    if (!request) {
      const error: any = new Error('Join request not found.');
      error.statusCode = 404;
      error.code = 'REQUEST_NOT_FOUND';
      throw error;
    }

    if (request.team.teamLeadId !== leadUserId) {
      const error: any = new Error('Only the team lead can reject join requests.');
      error.statusCode = 403;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    await prisma.teamJoinRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        respondedAt: new Date(),
        respondedBy: leadUserId,
      },
    });

    // Notification to Requester
    await NotificationService.createNotification({
      recipientId: request.userId,
      type: 'JOIN_REQUEST_REJECTED',
      title: 'Join Request Update',
      message: `Your request to join "${request.team.name}" was not accepted.`,
      entityType: 'TEAM',
      entityId: request.teamId,
    });

    return { message: 'Join request rejected.' };
  }

  public static async cancelJoinRequest(requestId: string, userId: string) {
    const request = await prisma.teamJoinRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.userId !== userId) {
      const error: any = new Error('Pending request not found.');
      error.statusCode = 404;
      error.code = 'REQUEST_NOT_FOUND';
      throw error;
    }

    await prisma.teamJoinRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
    });

    return { message: 'Join request cancelled.' };
  }

  public static async sendInvitation(teamId: string, invitedUserId: string, leadUserId: string, message?: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: { where: { status: 'ACTIVE' } } },
    });

    if (!team) {
      const error: any = new Error('Team not found.');
      error.statusCode = 404;
      error.code = 'TEAM_NOT_FOUND';
      throw error;
    }

    if (team.teamLeadId !== leadUserId) {
      const error: any = new Error('Only the team lead can send invitations.');
      error.statusCode = 403;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    if (team.members.length >= team.maxMembers) {
      const error: any = new Error('Team capacity reached.');
      error.statusCode = 400;
      error.code = 'TEAM_FULL';
      throw error;
    }

    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId,
        invitedUserId,
        invitedByUserId: leadUserId,
        message: message || null,
        status: 'PENDING',
      },
    });

    // Notification to Candidate
    await NotificationService.createNotification({
      recipientId: invitedUserId,
      type: 'TEAM_INVITATION_RECEIVED',
      title: 'Team Invitation Received',
      message: `You have been invited to join team "${team.name}".`,
      entityType: 'TEAM',
      entityId: team.id,
    });

    return invitation;
  }

  public static async acceptInvitation(invitationId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const invitation = await tx.teamInvitation.findUnique({
        where: { id: invitationId },
        include: { team: { include: { members: { where: { status: 'ACTIVE' } } } } },
      });

      if (!invitation || invitation.invitedUserId !== userId || invitation.status !== 'PENDING') {
        const error: any = new Error('Valid pending invitation not found.');
        error.statusCode = 404;
        error.code = 'INVITATION_NOT_FOUND';
        throw error;
      }

      if (invitation.team.members.length >= invitation.team.maxMembers) {
        const error: any = new Error('Team capacity reached.');
        error.statusCode = 400;
        error.code = 'TEAM_FULL';
        throw error;
      }

      await tx.teamMember.upsert({
        where: { teamId_userId: { teamId: invitation.teamId, userId } },
        update: { status: 'ACTIVE', role: 'MEMBER' },
        create: { teamId: invitation.teamId, userId, role: 'MEMBER', status: 'ACTIVE' },
      });

      await tx.teamInvitation.update({
        where: { id: invitationId },
        data: { status: 'ACCEPTED', respondedAt: new Date() },
      });

      // Notification to Team Lead
      await tx.notification.create({
        data: {
          recipientId: invitation.team.teamLeadId,
          type: 'TEAM_INVITATION_ACCEPTED',
          title: 'Invitation Accepted!',
          message: `A candidate has accepted your invitation to join "${invitation.team.name}".`,
          entityType: 'TEAM',
          entityId: invitation.teamId,
          isRead: false,
        },
      });

      return { message: 'Team invitation accepted.' };
    });
  }

  public static async rejectInvitation(invitationId: string, userId: string) {
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
      include: { team: true },
    });

    if (!invitation || invitation.invitedUserId !== userId) {
      const error: any = new Error('Invitation not found.');
      error.statusCode = 404;
      error.code = 'INVITATION_NOT_FOUND';
      throw error;
    }

    await prisma.teamInvitation.update({
      where: { id: invitationId },
      data: { status: 'REJECTED', respondedAt: new Date() },
    });

    return { message: 'Team invitation rejected.' };
  }

  public static async getUserTeams(userId: string) {
    const memberships = await prisma.teamMember.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        team: {
          include: {
            event: true,
            members: { where: { status: 'ACTIVE' } },
            teamLead: { select: { id: true, name: true, profileImage: true } },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return memberships.map((m) => ({
      id: m.team.id,
      name: m.team.name,
      description: m.team.description,
      eventId: m.team.eventId,
      eventTitle: m.team.event.title,
      role: m.role,
      teamLead: m.team.teamLead,
      currentMembersCount: m.team.members.length,
      maxMembers: m.team.maxMembers,
      recruitmentOpen: m.team.recruitmentOpen,
      status: m.team.status,
      joinedAt: m.joinedAt.toISOString(),
    }));
  }

  public static async getUserJoinRequests(userId: string) {
    const requests = await prisma.teamJoinRequest.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            event: true,
            teamLead: { select: { id: true, name: true, profileImage: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests.map((r) => ({
      id: r.id,
      teamId: r.team.id,
      teamName: r.team.name,
      eventTitle: r.team.event.title,
      teamLeadName: r.team.teamLead.name,
      message: r.message,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  public static async getUserInvitations(userId: string) {
    const invitations = await prisma.teamInvitation.findMany({
      where: { invitedUserId: userId },
      include: {
        team: {
          include: {
            event: true,
            teamLead: { select: { id: true, name: true, profileImage: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((inv) => ({
      id: inv.id,
      teamId: inv.team.id,
      teamName: inv.team.name,
      eventTitle: inv.team.event.title,
      invitedByName: inv.team.teamLead.name,
      message: inv.message,
      status: inv.status,
      createdAt: inv.createdAt.toISOString(),
    }));
  }

  public static async removeMember(teamId: string, targetUserId: string, leadUserId: string) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      const error: any = new Error('Team not found.');
      error.statusCode = 404;
      error.code = 'TEAM_NOT_FOUND';
      throw error;
    }

    if (team.teamLeadId !== leadUserId) {
      const error: any = new Error('Only the team lead can remove members.');
      error.statusCode = 403;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    if (targetUserId === leadUserId) {
      const error: any = new Error('Team lead cannot remove themselves. Transfer leadership first.');
      error.statusCode = 400;
      error.code = 'LEAD_REMOVAL_FORBIDDEN';
      throw error;
    }

    await prisma.teamMember.updateMany({
      where: { teamId, userId: targetUserId },
      data: { status: 'REMOVED' },
    });

    // Notification to Target User
    await NotificationService.createNotification({
      recipientId: targetUserId,
      type: 'MEMBER_REMOVED',
      title: 'Team Membership Update',
      message: `You have been removed from team "${team.name}".`,
      entityType: 'TEAM',
      entityId: team.id,
    });

    return { message: 'Member removed from team.' };
  }

  public static async leaveTeam(teamId: string, userId: string) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      const error: any = new Error('Team not found.');
      error.statusCode = 404;
      error.code = 'TEAM_NOT_FOUND';
      throw error;
    }

    if (team.teamLeadId === userId) {
      const error: any = new Error('Team lead cannot leave the team. Transfer leadership first.');
      error.statusCode = 400;
      error.code = 'LEAD_LEAVE_FORBIDDEN';
      throw error;
    }

    await prisma.teamMember.updateMany({
      where: { teamId, userId },
      data: { status: 'LEFT' },
    });

    return { message: 'You have left the team.' };
  }

  public static async getTeamRequests(teamId: string, leadUserId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { teamLeadId: true, name: true, event: { select: { title: true } } },
    });

    if (!team) {
      const error: any = new Error('Team not found.');
      error.statusCode = 404;
      error.code = 'TEAM_NOT_FOUND';
      throw error;
    }

    if (team.teamLeadId !== leadUserId) {
      const error: any = new Error('Only the team lead can view team join requests.');
      error.statusCode = 403;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const requests = await prisma.teamJoinRequest.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            studentProfile: {
              include: { college: true, department: true },
            },
            professionalProfile: true,
            skills: { include: { skill: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return requests.map((r) => ({
      id: r.id,
      teamId: r.teamId,
      teamName: team.name,
      eventName: team.event.title,
      eventTitle: team.event.title,
      applicantId: r.user.id,
      applicantName: r.user.name,
      applicantAvatarUrl: r.user.profileImage,
      applicantCollege: r.user.studentProfile?.college?.name || r.user.professionalProfile?.company || 'Institution',
      applicantDepartment: r.user.studentProfile?.department?.name || r.user.professionalProfile?.jobTitle || 'Department',
      applicantGithubUrl: r.user.studentProfile?.githubUrl || r.user.professionalProfile?.githubUrl || 'https://github.com',
      applicantLinkedinUrl: r.user.studentProfile?.linkedinUrl || r.user.professionalProfile?.linkedinUrl || 'https://linkedin.com',
      applicantSkills: r.user.skills.map((us) => us.skill.name),
      matchScore: 95,
      message: r.message,
      status: r.status,
      requestedAt: r.createdAt.toISOString(),
      createdAt: r.createdAt.toISOString(),
    }));
  }
}

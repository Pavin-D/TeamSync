import { prisma } from '../config/database';
import { NotificationService } from './notification.service';

export class WorkspaceService {
  public static async verifyTeamAccess(userId: string, teamId: string, options?: { allowPublicView?: boolean }) {
    const membership = await prisma.teamMember.findFirst({
      where: { teamId, userId, status: 'ACTIVE' },
    });

    const mentorshipAccess = await prisma.mentorship.findFirst({
      where: {
        menteeTeamId: teamId,
        mentorId: userId,
        status: { in: ['ACCEPTED', 'ACTIVE', 'REQUESTED'] },
      },
    });

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { teamLeadId: true },
    });

    if (!team) {
      const error: any = new Error('Team not found.');
      error.statusCode = 404;
      error.code = 'TEAM_NOT_FOUND';
      throw error;
    }

    const isLead = team.teamLeadId === userId;
    const isMember = !!membership || !!mentorshipAccess;

    // If options explicitly allow public view or if user is an admin, do not throw 403
    if (!isMember && !isLead && !options?.allowPublicView) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (user?.role !== 'PLATFORM_ADMIN' && user?.role !== 'COLLEGE_ADMIN') {
        const error: any = new Error('Access denied. You are not a member of this team workspace.');
        error.statusCode = 403;
        error.code = 'WORKSPACE_ACCESS_DENIED';
        throw error;
      }
    }

    return { isLead, isMember };
  }

  public static async getWorkspaceOverview(userId: string, teamId: string) {
    const { isLead, isMember } = await this.verifyTeamAccess(userId, teamId, { allowPublicView: true });

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
                email: true,
                role: true,
                profileImage: true,
                studentProfile: { include: { college: true, department: true } },
                professionalProfile: true,
                skills: { include: { skill: true } },
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        announcements: {
          include: {
            author: { select: { id: true, name: true, profileImage: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        activities: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        links: true,
        mentorships: {
          where: { status: { in: ['ACCEPTED', 'ACTIVE'] } },
          include: {
            mentor: {
              select: {
                id: true,
                name: true,
                profileImage: true,
                professionalProfile: true,
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

    // 1. Calculate project progress from completed tasks ratio
    const totalTasks = team.tasks.length;
    const completedTasks = team.tasks.filter((t) => t.status === 'COMPLETED').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 2. Aggregate unique skills across all active team members
    const allSkillsMap = new Map<string, string>();
    team.members.forEach((m) => {
      m.user.skills.forEach((us) => {
        allSkillsMap.set(us.skill.name.toLowerCase(), us.skill.name);
      });
    });
    const teamSkills = Array.from(allSkillsMap.values());

    // 3. Skill Gap Breakdown against event description / requiredSkills
    const requiredSkillsSet = new Set<string>();
    if (team.requiredSkills) {
      team.requiredSkills.split(',').forEach((s) => requiredSkillsSet.add(s.trim()));
    } else {
      const commonTechs = ['React', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'PyTorch', 'PostgreSQL', 'Docker', 'UI/UX'];
      commonTechs.forEach((tech) => {
        if (team.event.description.toLowerCase().includes(tech.toLowerCase())) {
          requiredSkillsSet.add(tech);
        }
      });
    }

    const requiredSkills = Array.from(requiredSkillsSet);
    const coveredSkills = requiredSkills.filter((req) => allSkillsMap.has(req.toLowerCase()));
    const missingSkills = requiredSkills.filter((req) => !allSkillsMap.has(req.toLowerCase()));

    const mentor = team.mentorships[0]?.mentor || null;

    return {
      team: {
        id: team.id,
        name: team.name,
        description: team.description,
        status: team.status,
        recruitmentOpen: team.recruitmentOpen,
        maxMembers: team.maxMembers,
        currentMembersCount: team.members.length,
        githubRepoUrl: team.githubRepoUrl,
        isCurrentUserLead: isLead,
        teamLead: {
          id: team.teamLead.id,
          name: team.teamLead.name,
          email: team.teamLead.email,
          profileImage: team.teamLead.profileImage,
          organization: team.teamLead.studentProfile?.college?.name || team.teamLead.professionalProfile?.company || 'TeamSync Member',
        },
      },
      event: {
        id: team.event.id,
        title: team.event.title,
        organizer: team.event.organizer,
        startDate: team.event.startDate.toISOString(),
        endDate: team.event.endDate.toISOString(),
        registrationDeadline: team.event.registrationDeadline.toISOString(),
        status: team.event.status,
        mode: team.event.mode,
      },
      members: team.members.map((m) => ({
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role,
        profileImage: m.user.profileImage,
        college: m.user.studentProfile?.college?.name || m.user.professionalProfile?.company || 'Institution',
        department: m.user.studentProfile?.department?.name || m.user.professionalProfile?.jobTitle || 'Department',
        skills: m.user.skills.map((us) => us.skill.name),
        joinedAt: m.joinedAt.toISOString(),
      })),
      progress: {
        totalTasks,
        completedTasks,
        percentage: progressPercentage,
      },
      skillsSummary: {
        allTeamSkills: teamSkills,
        requiredSkills,
        coveredSkills,
        missingSkills,
      },
      mentor: mentor
        ? {
            id: mentor.id,
            name: mentor.name,
            avatarUrl: mentor.profileImage,
            company: mentor.professionalProfile?.company || 'Industry Partner',
            jobTitle: mentor.professionalProfile?.jobTitle || 'Mentor',
          }
        : null,
      tasks: team.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        assignedTo: t.assignedTo,
        assigneeName: t.assignee?.name || 'Unassigned',
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        createdAt: t.createdAt.toISOString(),
      })),
      announcements: team.announcements.map((a) => ({
        id: a.id,
        title: a.title,
        message: a.message,
        authorName: a.author.name,
        authorAvatar: a.author.profileImage,
        createdAt: a.createdAt.toISOString(),
      })),
      activities: team.activities.map((act) => ({
        id: act.id,
        userName: act.user?.name || 'Team Action',
        description: act.description,
        activityType: act.activityType,
        createdAt: act.createdAt.toISOString(),
      })),
      links: team.links.map((l) => ({
        id: l.id,
        title: l.title,
        url: l.url,
        description: l.description,
      })),
    };
  }

  // --- Tasks API ---
  public static async getTasks(userId: string, teamId: string) {
    await this.verifyTeamAccess(userId, teamId, { allowPublicView: true });

    const tasks = await prisma.teamTask.findMany({
      where: { teamId },
      include: {
        assignee: { select: { id: true, name: true, profileImage: true } },
        creator: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      assignedTo: t.assignedTo,
      assigneeName: t.assignee?.name || 'Unassigned',
      assigneeAvatar: t.assignee?.profileImage || null,
      createdBy: t.createdBy,
      creatorName: t.creator.name,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      createdAt: t.createdAt.toISOString(),
    }));
  }

  public static async createTask(userId: string, teamId: string, data: any) {
    await this.verifyTeamAccess(userId, teamId);

    const task = await prisma.teamTask.create({
      data: {
        teamId,
        createdBy: userId,
        title: data.title,
        description: data.description || null,
        assignedTo: data.assignedTo || null,
        priority: data.priority || 'MEDIUM',
        status: 'TO_DO',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    // Activity Log
    const creator = await prisma.user.findUnique({ where: { id: userId } });
    await prisma.teamActivity.create({
      data: {
        teamId,
        userId,
        activityType: 'TASK_CREATED',
        description: `${creator?.name || 'A team member'} created task "${task.title}".`,
      },
    });

    // Notify assigned member
    if (data.assignedTo && data.assignedTo !== userId) {
      await NotificationService.createNotification({
        recipientId: data.assignedTo,
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: `You were assigned task "${task.title}".`,
        entityType: 'TEAM',
        entityId: teamId,
      });
    }

    return task;
  }

  public static async updateTask(userId: string, teamId: string, taskId: string, data: any) {
    await this.verifyTeamAccess(userId, teamId);

    const existingTask = await prisma.teamTask.findUnique({ where: { id: taskId } });
    if (!existingTask || existingTask.teamId !== teamId) {
      const error: any = new Error('Task not found.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const task = await prisma.teamTask.update({
      where: { id: taskId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.assignedTo !== undefined ? { assignedTo: data.assignedTo } : {}),
        ...(data.priority ? { priority: data.priority } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.dueDate !== undefined ? { dueDate: data.dueDate ? new Date(data.dueDate) : null } : {}),
      },
    });

    // Activity Log on status completion
    if (data.status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      const updater = await prisma.user.findUnique({ where: { id: userId } });
      await prisma.teamActivity.create({
        data: {
          teamId,
          userId,
          activityType: 'TASK_COMPLETED',
          description: `${updater?.name || 'A team member'} completed task "${task.title}".`,
        },
      });
    }

    return task;
  }

  public static async deleteTask(userId: string, teamId: string, taskId: string) {
    await this.verifyTeamAccess(userId, teamId);

    const task = await prisma.teamTask.findUnique({ where: { id: taskId } });
    if (!task || task.teamId !== teamId) {
      const error: any = new Error('Task not found.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    await prisma.teamTask.delete({ where: { id: taskId } });
    return { message: 'Task deleted.' };
  }

  // --- Announcements API ---
  public static async getAnnouncements(userId: string, teamId: string) {
    await this.verifyTeamAccess(userId, teamId, { allowPublicView: true });

    const announcements = await prisma.teamAnnouncement.findMany({
      where: { teamId },
      include: {
        author: { select: { id: true, name: true, profileImage: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return announcements.map((a) => ({
      id: a.id,
      title: a.title,
      message: a.message,
      authorName: a.author.name,
      authorAvatar: a.author.profileImage,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  public static async createAnnouncement(userId: string, teamId: string, data: any) {
    const { isLead } = await this.verifyTeamAccess(userId, teamId);
    if (!isLead) {
      const error: any = new Error('Only the Team Lead can post team announcements.');
      error.statusCode = 403;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const announcement = await prisma.teamAnnouncement.create({
      data: {
        teamId,
        createdBy: userId,
        title: data.title,
        message: data.message,
      },
    });

    // Notify all active team members
    const members = await prisma.teamMember.findMany({
      where: { teamId, status: 'ACTIVE', userId: { not: userId } },
    });

    for (const m of members) {
      await NotificationService.createNotification({
        recipientId: m.userId,
        type: 'TEAM_ANNOUNCEMENT',
        title: `Announcement: ${data.title}`,
        message: data.message,
        entityType: 'TEAM',
        entityId: teamId,
      });
    }

    // Activity Log
    await prisma.teamActivity.create({
      data: {
        teamId,
        userId,
        activityType: 'ANNOUNCEMENT_POSTED',
        description: `Team Lead posted announcement "${announcement.title}".`,
      },
    });

    return announcement;
  }

  // --- Leadership Transfer ---
  public static async transferLeadership(userId: string, teamId: string, newLeadUserId: string) {
    const { isLead } = await this.verifyTeamAccess(userId, teamId);
    if (!isLead) {
      const error: any = new Error('Only the current Team Lead can transfer leadership.');
      error.statusCode = 403;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const newLeadMember = await prisma.teamMember.findFirst({
      where: { teamId, userId: newLeadUserId, status: 'ACTIVE' },
    });

    if (!newLeadMember) {
      const error: any = new Error('Target user is not an active member of this team.');
      error.statusCode = 400;
      error.code = 'INVALID_NEW_LEAD';
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update Team lead pointer
      await tx.team.update({
        where: { id: teamId },
        data: { teamLeadId: newLeadUserId },
      });

      // 2. Demote old lead role to MEMBER
      await tx.teamMember.updateMany({
        where: { teamId, userId },
        data: { role: 'MEMBER' },
      });

      // 3. Promote new lead role to LEAD
      await tx.teamMember.updateMany({
        where: { teamId, userId: newLeadUserId },
        data: { role: 'LEAD' },
      });

      // 4. Log Activity
      await tx.teamActivity.create({
        data: {
          teamId,
          userId,
          activityType: 'LEADERSHIP_TRANSFERRED',
          description: `Team leadership transferred to ${newLeadMember.userId}.`,
        },
      });

      // 5. Notify New Lead
      await NotificationService.createNotification({
        recipientId: newLeadUserId,
        type: 'LEADERSHIP_TRANSFERRED',
        title: 'Team Leadership Transferred',
        message: 'You are now the Team Lead of this workspace.',
        entityType: 'TEAM',
        entityId: teamId,
      });

      return { message: 'Leadership transferred successfully.' };
    });
  }

  // --- Settings & Links ---
  public static async updateTeamSettings(userId: string, teamId: string, data: any) {
    const { isLead } = await this.verifyTeamAccess(userId, teamId);
    if (!isLead) {
      const error: any = new Error('Only the Team Lead can update team settings.');
      error.statusCode = 403;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.recruitmentOpen !== undefined ? { recruitmentOpen: data.recruitmentOpen } : {}),
        ...(data.githubRepoUrl !== undefined ? { githubRepoUrl: data.githubRepoUrl } : {}),
      },
    });

    return team;
  }

  public static async addTeamLink(userId: string, teamId: string, data: any) {
    await this.verifyTeamAccess(userId, teamId);

    const link = await prisma.teamLink.create({
      data: {
        teamId,
        title: data.title,
        url: data.url,
        description: data.description || null,
      },
    });

    return link;
  }
}

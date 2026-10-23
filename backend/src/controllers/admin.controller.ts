import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

export async function getPlatformAnalyticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const analytics = await AdminService.getPlatformAnalytics();
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AdminService.getAdminUsers(req.query);
    return res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateUserStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { userId } = req.params;
    const { status, reason } = req.body;

    const updated = await AdminService.updateUserStatus(req.user.id, userId, status, reason);
    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminCollegesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AdminService.getAdminColleges(req.query);
    return res.status(200).json({
      success: true,
      data: result.colleges,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminAuditLogsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AdminService.getAdminAuditLogs(req.query);
    return res.status(200).json({
      success: true,
      data: result.auditLogs,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPlatformSettingsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await AdminService.getPlatformSettings();
    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updatePlatformSettingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await AdminService.getPlatformSettings();
    return res.status(200).json({
      success: true,
      data: { ...settings, ...req.body },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminUserDetailHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const user = await AdminService.getAdminUserDetail(userId);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createAdminUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await AdminService.createAdminUser(req.body);
    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const user = await AdminService.updateAdminUser(userId, req.body);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminTeamsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AdminService.getAdminTeams(req.query);
    return res.status(200).json({
      success: true,
      data: result.teams,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminTeamDetailHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { teamId } = req.params;
    const team = await AdminService.getAdminTeamDetail(teamId);
    return res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminTeamHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { teamId } = req.params;
    const team = await AdminService.updateAdminTeam(teamId, req.body);
    return res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminTeamHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { teamId } = req.params;
    const result = await AdminService.deleteAdminTeam(teamId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminEventsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await AdminService.getAdminEvents(req.query);
    return res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminEventDetailHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.params;
    const event = await AdminService.getAdminEventDetail(eventId);
    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createAdminEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const creatorId = req.user?.id || '';
    const event = await AdminService.createAdminEvent(creatorId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: event,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.params;
    const event = await AdminService.updateAdminEvent(eventId, req.body);
    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.params;
    const result = await AdminService.deleteAdminEvent(eventId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createAdminCollegeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const college = await AdminService.createAdminCollege(req.body);
    return res.status(201).json({
      success: true,
      message: 'College created successfully.',
      data: college,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminCollegeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { collegeId } = req.params;
    const college = await AdminService.updateAdminCollege(collegeId, req.body);
    return res.status(200).json({
      success: true,
      data: college,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminCollegeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { collegeId } = req.params;
    const result = await AdminService.deleteAdminCollege(collegeId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function verifyAdminCollegeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { collegeId } = req.params;
    const { status, notes } = req.body;
    const college = await AdminService.verifyAdminCollege(collegeId, status, notes);
    return res.status(200).json({
      success: true,
      data: college,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getSystemHealthHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const health = await AdminService.getSystemHealth();
    return res.status(200).json({
      success: true,
      data: health,
    });
  } catch (error) {
    return next(error);
  }
}

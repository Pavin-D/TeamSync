import { Request, Response, NextFunction } from 'express';
import { WorkspaceService } from '../services/workspace.service';

export async function getTeamWorkspaceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const data = await WorkspaceService.getWorkspaceOverview(req.user.id, teamId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTasksHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const tasks = await WorkspaceService.getTasks(req.user.id, teamId);

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createTaskHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const task = await WorkspaceService.createTask(req.user.id, teamId, req.body);

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateTaskHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId, taskId } = req.params;
    const task = await WorkspaceService.updateTask(req.user.id, teamId, taskId, req.body);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTaskHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId, taskId } = req.params;
    await WorkspaceService.deleteTask(req.user.id, teamId, taskId);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAnnouncementsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const announcements = await WorkspaceService.getAnnouncements(req.user.id, teamId);

    return res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createAnnouncementHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const announcement = await WorkspaceService.createAnnouncement(req.user.id, teamId, req.body);

    return res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    return next(error);
  }
}

export async function transferLeadershipHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const { newLeadUserId } = req.body;
    const result = await WorkspaceService.transferLeadership(req.user.id, teamId, newLeadUserId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateSettingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const team = await WorkspaceService.updateTeamSettings(req.user.id, teamId, req.body);

    return res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    return next(error);
  }
}

export async function addTeamLinkHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const link = await WorkspaceService.addTeamLink(req.user.id, teamId, req.body);

    return res.status(201).json({
      success: true,
      data: link,
    });
  } catch (error) {
    return next(error);
  }
}

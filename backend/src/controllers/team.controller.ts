import { Request, Response, NextFunction } from 'express';
import { TeamService } from '../services/team.service';
import { createTeamSchema, joinRequestSchema } from '../validators/team.validator';

export async function createTeamHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const validatedData = createTeamSchema.parse(req.body);
    const team = await TeamService.createTeam(req.user.id, validatedData);

    return res.status(201).json({
      success: true,
      message: 'Team created successfully.',
      data: team,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTeamsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUserId = req.user?.id;
    const result = await TeamService.getTeams({ ...req.query, currentUserId });

    return res.status(200).json({
      success: true,
      data: result.teams,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTeamByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { teamId } = req.params;
    const currentUserId = req.user?.id;
    const team = await TeamService.getTeamById(teamId, currentUserId);

    return res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createJoinRequestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const validatedData = joinRequestSchema.parse(req.body);
    const result = await TeamService.createJoinRequest(teamId, req.user.id, validatedData.message);

    return res.status(201).json({
      success: true,
      message: 'Join request submitted successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function acceptJoinRequestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { requestId } = req.params;
    const result = await TeamService.acceptJoinRequest(requestId, req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function rejectJoinRequestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { requestId } = req.params;
    const result = await TeamService.rejectJoinRequest(requestId, req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function cancelJoinRequestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { requestId } = req.params;
    const result = await TeamService.cancelJoinRequest(requestId, req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getUserTeamsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const teams = await TeamService.getUserTeams(req.user.id);

    return res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getUserJoinRequestsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const requests = await TeamService.getUserJoinRequests(req.user.id);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
}

export async function removeMemberHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId, userId } = req.params;
    const result = await TeamService.removeMember(teamId, userId, req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function leaveTeamHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const result = await TeamService.leaveTeam(teamId, req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTeamRequestsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const requests = await TeamService.getTeamRequests(teamId, req.user.id);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
}

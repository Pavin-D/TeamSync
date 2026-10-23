import { Request, Response, NextFunction } from 'express';
import { MentorshipService } from '../services/mentorship.service';

export async function getMentorsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const result = await MentorshipService.getMentors(req.query, req.user.id);

    return res.status(200).json({
      success: true,
      data: result.mentors,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMentorByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { mentorId } = req.params;
    const mentor = await MentorshipService.getMentorById(mentorId);

    return res.status(200).json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createMentorshipRequestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const mentorship = await MentorshipService.createRequest(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      data: mentorship,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMyMentorshipRequestsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const requests = await MentorshipService.getMyMentorshipRequests(req.user.id);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getActiveMentorshipsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const mentorships = await MentorshipService.getActiveMentorships(req.user.id);

    return res.status(200).json({
      success: true,
      data: mentorships,
    });
  } catch (error) {
    return next(error);
  }
}

export async function respondToRequestHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { requestId } = req.params;
    const { action, message } = req.body;

    const result = await MentorshipService.respondToRequest(req.user.id, requestId, action, message);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getStaffMenteeAnalyticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const analytics = await MentorshipService.getStaffMenteeAnalytics(req.user.id);
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return next(error);
  }
}

export async function inviteTeamAsMentorHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId, message } = req.body;
    const result = await MentorshipService.inviteTeamAsMentor(req.user.id, teamId, message);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

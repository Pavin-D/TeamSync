import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendation.service';

export async function getTeammateRecommendationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const eventId = req.query.eventId as string | undefined;
    const teamId = req.query.teamId as string | undefined;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await RecommendationService.getTeammateRecommendations(req.user.id, {
      eventId,
      teamId,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result.recommendations,
      event: result.event,
      team: result.team,
      skillGap: result.skillGap,
      pagination: result.pagination,
      ...(result.message ? { message: result.message } : {}),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTeamRecommendationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const result = await RecommendationService.getRecommendedTeams(req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEventRecommendationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const result = await RecommendationService.getRecommendedEvents(req.user.id);

    return res.status(200).json({
      success: true,
      data: result,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getNearbyPeopleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const radius = parseFloat(req.query.radius as string) || 25;
    const result = await RecommendationService.getNearbyPeople(req.user.id, radius);

    return res.status(200).json({
      success: true,
      data: result,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
}

export async function globalDiscoverySearchHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const q = (req.query.q as string) || '';
    const type = req.query.type as string | undefined;

    const result = await RecommendationService.globalDiscoverySearch(q, type);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMentorRecommendationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const eventId = req.query.eventId as string | undefined;
    const result = await RecommendationService.getMentorRecommendations(req.user.id, { eventId });

    return res.status(200).json({
      success: true,
      data: result.mentors,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTeamSkillGapHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { teamId } = req.params;
    const result = await RecommendationService.analyzeTeamSkillGap(teamId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

import { Request, Response, NextFunction } from 'express';
import { RankingService } from '../services/ranking.service';

export async function getStudentRankingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await RankingService.getStudentRankings(req.query);

    return res.status(200).json({
      success: true,
      data: result.rankings,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCollegeRankingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await RankingService.getCollegeRankings(req.query);

    return res.status(200).json({
      success: true,
      data: result.rankings,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

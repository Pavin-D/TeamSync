import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service';

export async function globalSearchHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await SearchService.globalSearch(req.query as any);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function searchPeopleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await SearchService.searchPeople(req.query as any);
    return res.status(200).json({
      success: true,
      data: result.people,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function searchTeamsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await SearchService.searchTeams(req.query as any);
    return res.status(200).json({
      success: true,
      data: result.teams,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function searchEventsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await SearchService.searchEvents(req.query as any);
    return res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function searchMentorsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await SearchService.searchMentors(req.query as any);
    return res.status(200).json({
      success: true,
      data: result.mentors,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function searchCollegesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await SearchService.searchColleges(req.query as any);
    return res.status(200).json({
      success: true,
      data: result.colleges,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

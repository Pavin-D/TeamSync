import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';
import { createReportSchema, reviewReportSchema } from '../validators/report.validator';

export async function createReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const validatedData = createReportSchema.parse(req.body);
    const result = await ReportService.createReport(req.user.id, validatedData);

    return res.status(201).json({
      success: true,
      message: 'Report submitted successfully for administrative review.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getUserReportSummaryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const summary = await ReportService.getUserReportSummary(userId);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMySubmittedReportsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const reports = await ReportService.getMySubmittedReports(req.user.id);

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminReportsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ReportService.getAdminReports(req.query);

    return res.status(200).json({
      success: true,
      data: result.reports,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminReportStatsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await ReportService.getAdminReportStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTopReportedUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await ReportService.getTopReportedUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
}

export async function reviewAdminReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { reportId } = req.params;
    const validatedData = reviewReportSchema.parse(req.body);
    const updated = await ReportService.reviewAdminReport(reportId, req.user.id, validatedData);

    return res.status(200).json({
      success: true,
      message: 'Report moderation status updated successfully.',
      data: updated,
    });
  } catch (error) {
    return next(error);
  }
}

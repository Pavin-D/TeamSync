import { prisma } from '../config/database';
import { NotificationService } from './notification.service';

export class ReportService {
  public static async createReport(reporterId: string, data: any) {
    if (reporterId === data.reportedUserId) {
      const error: any = new Error('You cannot report yourself.');
      error.statusCode = 400;
      error.code = 'SELF_REPORT_FORBIDDEN';
      throw error;
    }

    const reportedUser = await prisma.user.findUnique({ where: { id: data.reportedUserId } });
    if (!reportedUser) {
      const error: any = new Error('Reported user not found.');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Check duplicate pending report by same reporter for same user
    const duplicate = await prisma.report.findFirst({
      where: {
        reporterId,
        reportedUserId: data.reportedUserId,
        status: { in: ['PENDING', 'UNDER_REVIEW'] },
        reason: data.reason,
      },
    });

    if (duplicate) {
      const error: any = new Error('You already have a pending report under review for this user.');
      error.statusCode = 409;
      error.code = 'DUPLICATE_REPORT';
      throw error;
    }

    const report = await prisma.report.create({
      data: {
        reporterId,
        reportedUserId: data.reportedUserId,
        teamId: data.teamId || null,
        eventId: data.eventId || null,
        reason: data.reason,
        description: data.description,
        status: 'PENDING',
        severity: 'MEDIUM',
      },
    });

    return {
      id: report.id,
      reportedUserId: report.reportedUserId,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt.toISOString(),
    };
  }

  public static async getUserReportSummary(targetUserId: string) {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        participations: true,
        reportsReceived: true,
      },
    });

    if (!user) {
      const error: any = new Error('User not found.');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const total = user.reportsReceived.length;
    const confirmed = user.reportsReceived.filter((r) => r.resolution === 'CONFIRMED').length;
    const pending = user.reportsReceived.filter((r) => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length;
    const dismissed = user.reportsReceived.filter((r) => r.status === 'DISMISSED' || r.resolution === 'DISMISSED').length;

    // Reputation Formula: Base 100 + (Successful Participations * 5) - (Confirmed Misconduct Reports * 15)
    const baseReputation = 100;
    const bonus = user.participations.length * 5;
    const penalty = confirmed * 15;
    const reputationScore = Math.max(10, Math.min(100, baseReputation + bonus - penalty));

    let trustBadge = 'Reliable Team Member';
    if (reputationScore >= 95) trustBadge = 'Top Reliable Teammate ★';
    else if (reputationScore < 60) trustBadge = 'Under Moderation Review';

    return {
      userId: user.id,
      name: user.name,
      reputationScore,
      trustBadge,
      participationsCount: user.participations.length,
      reportsSummary: {
        total,
        confirmed,
        pending,
        dismissed,
      },
    };
  }

  public static async getMySubmittedReports(reporterId: string) {
    const reports = await prisma.report.findMany({
      where: { reporterId },
      include: {
        reportedUser: { select: { id: true, name: true, profileImage: true, role: true } },
        team: { select: { id: true, name: true } },
        event: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reports.map((r) => ({
      id: r.id,
      reportedUser: r.reportedUser,
      teamName: r.team?.name || null,
      eventTitle: r.event?.title || null,
      reason: r.reason,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  public static async getAdminReports(queryParams: any) {
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(queryParams.status ? { status: queryParams.status } : {}),
      ...(queryParams.severity ? { severity: queryParams.severity } : {}),
      ...(queryParams.reason ? { reason: queryParams.reason } : {}),
    };

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          reportedUser: { select: { id: true, name: true, email: true, role: true } },
          team: { select: { id: true, name: true } },
          event: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return {
      reports: reports.map((r) => ({
        id: r.id,
        reporter: r.reporter,
        reportedUser: r.reportedUser,
        teamName: r.team?.name || null,
        eventTitle: r.event?.title || null,
        reason: r.reason,
        description: r.description,
        status: r.status,
        severity: r.severity,
        resolution: r.resolution || null,
        reviewedBy: r.reviewedBy || null,
        reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async getAdminReportStats() {
    const [total, pending, underReview, resolved, dismissed] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.report.count({ where: { status: 'RESOLVED' } }),
      prisma.report.count({ where: { status: 'DISMISSED' } }),
    ]);

    return {
      totalReports: total,
      pendingReports: pending,
      underReviewReports: underReview,
      resolvedReports: resolved,
      dismissedReports: dismissed,
    };
  }

  public static async getTopReportedUsers() {
    const users = await prisma.user.findMany({
      where: {
        reportsReceived: { some: {} },
      },
      include: {
        reportsReceived: true,
        participations: true,
      },
    });

    const list = users
      .map((u) => {
        const confirmedCount = u.reportsReceived.filter((r) => r.resolution === 'CONFIRMED').length;
        const totalCount = u.reportsReceived.length;
        return {
          userId: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          isActive: u.isActive,
          totalReports: totalCount,
          confirmedReports: confirmedCount,
          requiresAdminThresholdAlert: confirmedCount >= 30,
        };
      })
      .sort((a, b) => b.confirmedReports - a.confirmedReports);

    return list;
  }

  public static async reviewAdminReport(reportId: string, adminUserId: string, data: any) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) {
      const error: any = new Error('Report not found.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: data.status,
        ...(data.severity ? { severity: data.severity } : {}),
        ...(data.resolution ? { resolution: data.resolution } : {}),
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
      },
    });

    // Check if reported user reached 30 confirmed reports threshold
    if (data.resolution === 'CONFIRMED') {
      const confirmedCount = await prisma.report.count({
        where: {
          reportedUserId: report.reportedUserId,
          resolution: 'CONFIRMED',
        },
      });

      if (confirmedCount >= 30) {
        // Platform Admin Alert Notification
        await NotificationService.createNotification({
          recipientId: adminUserId,
          type: 'ADMIN_THRESHOLD_ALERT',
          title: 'Confirmed Report Threshold Alert (30+)',
          message: `User ${report.reportedUserId} has accumulated ${confirmedCount} confirmed reports. Administrative action required.`,
          entityType: 'USER',
          entityId: report.reportedUserId,
        });
      }
    }

    return updatedReport;
  }
}

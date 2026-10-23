import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { prisma } from '../config/database';

async function resolveCollegeId(req: Request, targetCollegeId: string): Promise<string> {
  if (targetCollegeId && targetCollegeId !== 'me') {
    return targetCollegeId;
  }

  if (!req.user) {
    const firstCollege = await prisma.college.findFirst();
    return firstCollege?.id || '';
  }

  // 1. Check studentProfile
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: req.user.id },
    select: { collegeId: true },
  });
  if (studentProfile?.collegeId) {
    return studentProfile.collegeId;
  }

  // 2. Check by user name matching college name
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (user?.name) {
    const matchedByName = await prisma.college.findFirst({
      where: { name: { equals: user.name, mode: 'insensitive' } },
    });
    if (matchedByName) {
      return matchedByName.id;
    }
  }

  // 3. Fallback: find or create a college for this user
  let college = await prisma.college.findFirst();
  if (!college) {
    college = await prisma.college.create({
      data: {
        name: user?.name || 'Default Institution',
        isVerified: true,
      },
    });
  }
  return college.id;
}

async function verifyCollegeAccess(req: Request, targetCollegeId: string) {
  if (!req.user) {
    const error: any = new Error('Authentication required.');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  // PLATFORM_ADMIN has access to all colleges
  if (req.user.role === 'PLATFORM_ADMIN') return;

  // 'me' is always allowed for logged-in user
  if (targetCollegeId === 'me') return;

  // COLLEGE_ADMIN can only access their assigned collegeId
  if (req.user.role === 'COLLEGE_ADMIN') {
    const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    if (studentProfile && studentProfile.collegeId !== targetCollegeId) {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (user?.name) {
        const matchedByName = await prisma.college.findFirst({
          where: { name: { equals: user.name, mode: 'insensitive' } },
        });
        if (matchedByName && matchedByName.id === targetCollegeId) {
          return;
        }
      }
      const error: any = new Error('Access denied. You are not authorized to view another institution\'s analytics.');
      error.statusCode = 403;
      error.code = 'COLLEGE_ISOLATION_VIOLATION';
      throw error;
    }
  }
}

export async function getPersonalAnalyticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const analytics = await AnalyticsService.getPersonalAnalytics(req.user.id);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPersonalParticipationHistoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const history = await AnalyticsService.getPersonalParticipationHistory(req.user.id);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPersonalParticipationOverTimeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const data = await AnalyticsService.getPersonalParticipationOverTime(req.user.id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPersonalWinsOverTimeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const data = await AnalyticsService.getPersonalWinsOverTime(req.user.id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCollegeAnalyticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const analytics = await AnalyticsService.getCollegeAnalytics(collegeId);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCollegeStudentsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const result = await AnalyticsService.getCollegeStudents(collegeId, req.query);

    return res.status(200).json({
      success: true,
      data: result.students,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCollegeStudentDetailHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const student = await AnalyticsService.getCollegeStudentDetail(collegeId, req.params.studentId);

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCollegeDepartmentAnalyticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const analytics = await AnalyticsService.getCollegeDepartmentAnalytics(collegeId);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCollegeEventAnalyticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const analytics = await AnalyticsService.getCollegeEventAnalytics(collegeId);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCollegeTeamAnalyticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const analytics = await AnalyticsService.getCollegeTeamAnalytics(collegeId);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminPlatformAnalyticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await AnalyticsService.getAdminPlatformAnalytics();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCollegeMentorshipAnalyticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const stats = await AnalyticsService.getCollegeMentorshipAnalytics(collegeId);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return next(error);
  }
}

export async function addCollegeStudentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const student = await AnalyticsService.addCollegeStudent(collegeId, req.body);

    return res.status(201).json({
      success: true,
      message: 'Student added to institution successfully.',
      data: student,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteCollegeStudentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const result = await AnalyticsService.deleteCollegeStudent(collegeId, req.params.studentId);

    return res.status(200).json({
      success: true,
      message: 'Student removed from institution.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCollegeStaffHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const staff = await AnalyticsService.getCollegeStaff(collegeId);

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    return next(error);
  }
}

export async function addCollegeStaffHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const staffMember = await AnalyticsService.addCollegeStaff(collegeId, req.body);

    return res.status(201).json({
      success: true,
      message: 'Staff member added to institution successfully.',
      data: staffMember,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteCollegeStaffHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const result = await AnalyticsService.deleteCollegeStaff(collegeId, req.params.staffId);

    return res.status(200).json({
      success: true,
      message: 'Staff member removed from institution.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateCollegeStaffHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCollegeId = req.params.collegeId;
    await verifyCollegeAccess(req, rawCollegeId);
    const collegeId = await resolveCollegeId(req, rawCollegeId);

    const staffMember = await AnalyticsService.updateCollegeStaff(collegeId, req.params.staffId, req.body);

    return res.status(200).json({
      success: true,
      message: 'Staff member updated successfully.',
      data: staffMember,
    });
  } catch (error) {
    return next(error);
  }
}

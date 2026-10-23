import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export async function getColleges(req: Request, res: Response, next: NextFunction) {
  try {
    const colleges = await prisma.college.findMany({
      select: {
        id: true,
        name: true,
        emailDomain: true,
        isVerified: true,
        departments: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return res.status(200).json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCollegeDepartments(req: Request, res: Response, next: NextFunction) {
  try {
    const { collegeId } = req.params;

    const departments = await prisma.department.findMany({
      where: {
        collegeId,
      },
      select: {
        id: true,
        collegeId: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    return next(error);
  }
}

import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';
import {
  updateUserSchema,
  updateStudentProfileSchema,
  updateProfessionalProfileSchema,
} from '../validators/profile.validator';

export async function getStudentProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const profile = await ProfileService.getStudentProfile(req.user.id);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateStudentProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const validatedData = updateStudentProfileSchema.parse(req.body);
    const updatedProfile = await ProfileService.updateStudentProfile(req.user.id, validatedData);

    return res.status(200).json({
      success: true,
      message: 'Student profile updated successfully.',
      data: updatedProfile,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getProfessionalProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const profile = await ProfileService.getProfessionalProfile(req.user.id);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateProfessionalProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const validatedData = updateProfessionalProfileSchema.parse(req.body);
    const updatedProfile = await ProfileService.updateProfessionalProfile(req.user.id, validatedData);

    return res.status(200).json({
      success: true,
      message: 'Professional profile updated successfully.',
      data: updatedProfile,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const validatedData = updateUserSchema.parse(req.body);
    const updatedUser = await ProfileService.updateUser(req.user.id, validatedData);

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPublicUserProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const profile = await ProfileService.getPublicUserProfile(userId);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getUserSkillsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const skills = await ProfileService.getUserSkills(req.user.id);

    return res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    return next(error);
  }
}

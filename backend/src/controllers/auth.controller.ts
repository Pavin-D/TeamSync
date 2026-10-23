import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import {
  studentRegistrationSchema,
  professionalRegistrationSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

export async function registerStudentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = studentRegistrationSchema.parse(req.body);
    const result = await AuthService.registerStudent(validatedData);

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function registerProfessionalHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = professionalRegistrationSchema.parse(req.body);
    const result = await AuthService.registerProfessional(validatedData);

    return res.status(201).json({
      success: true,
      message: 'Professional account created successfully. Verification pending.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.loginUser(validatedData.email, validatedData.password);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function logoutHandler(req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}

export async function getMeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication token required.',
        },
      });
    }

    const user = await AuthService.getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function forgotPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    // Generic response to prevent email enumeration
    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been dispatched.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function resetPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    return res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function registerCollegeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { institutionName, officialEmail, password, institutionType, website, city, state, country } = req.body;
    const result = await AuthService.registerCollege({
      institutionName,
      officialEmail,
      password,
      institutionType,
      website,
      city,
      state,
      country,
    });
    return res.status(201).json({
      success: true,
      message: 'College account created successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function registerGeneralHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const role = (req.body.role || req.body.selectedRole || 'STUDENT').toUpperCase();
    if (role === 'PROFESSIONAL') {
      return registerProfessionalHandler(req, res, next);
    }
    return registerStudentHandler(req, res, next);
  } catch (error) {
    return next(error);
  }
}


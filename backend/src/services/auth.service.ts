import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config/environment';
import { GitHubService } from './github.service';

export interface RegisterStudentData {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  college: string;
  department: string;
  yearOfStudy?: number | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
}

export interface RegisterProfessionalData {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  company: string;
  jobTitle: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  employeeIdDocument?: string | null;
}

export interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'PROFESSIONAL' | 'COLLEGE_ADMIN' | 'PLATFORM_ADMIN';
    profileImage?: string | null;
    isVerified: boolean;
  };
  token: string;
}

export class AuthService {
  private static generateToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });
  }

  private static formatSafeUser(user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      studentProfile: user.studentProfile,
      professionalProfile: user.professionalProfile,
    };
  }

  public static async registerStudent(data: RegisterStudentData): Promise<AuthResult> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      const error: any = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Find or create default College & Department records for foreign key integrity
    let collegeRecord = await prisma.college.findFirst({
      where: { name: { equals: data.college, mode: 'insensitive' } },
    });

    if (!collegeRecord) {
      collegeRecord = await prisma.college.create({
        data: {
          name: data.college,
          isVerified: false,
        },
      });
    }

    let departmentRecord = await prisma.department.findFirst({
      where: {
        collegeId: collegeRecord.id,
        name: { equals: data.department, mode: 'insensitive' },
      },
    });

    if (!departmentRecord) {
      departmentRecord = await prisma.department.create({
        data: {
          collegeId: collegeRecord.id,
          name: data.department,
        },
      });
    }

    // Prisma Transaction for User + StudentProfile + NotificationPreference
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: 'STUDENT',
          phone: data.phone,
          isVerified: false,
        },
      });

      await tx.studentProfile.create({
        data: {
          userId: user.id,
          collegeId: collegeRecord.id,
          departmentId: departmentRecord.id,
          yearOfStudy: data.yearOfStudy || 1,
          githubUrl: data.githubUrl,
          linkedinUrl: data.linkedinUrl,
        },
      });

      await tx.notificationPreference.create({
        data: {
          userId: user.id,
        },
      });

      return user;
    });

    const token = this.generateToken(newUser.id, newUser.role);
    
    if (data.githubUrl) {
      try {
        await GitHubService.analyzeUserGitHub(newUser.id);
      } catch (err: any) {
        console.error('Failed to analyze GitHub during signup:', err.message || err);
      }
    }

    return {
      user: this.formatSafeUser(newUser),
      token,
    };
  }

  public static async registerCollege(data: {
    institutionName: string;
    officialEmail: string;
    password: string;
    institutionType?: string;
    website?: string;
    city: string;
    state: string;
    country: string;
  }): Promise<AuthResult> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.officialEmail },
    });
    if (existingUser) {
      const error: any = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    // Ensure college exists or create new (only using valid College model fields)
    let collegeRecord = await prisma.college.findFirst({
      where: { name: { equals: data.institutionName, mode: 'insensitive' } },
    });
    if (!collegeRecord) {
      // Create Location first if city/state/country provided
      let locationId: string | undefined;
      if (data.city && data.state && data.country) {
        const location = await prisma.location.create({
          data: {
            latitude: 0,
            longitude: 0,
            city: data.city,
            state: data.state,
            country: data.country,
          },
        });
        locationId = location.id;
      }

      collegeRecord = await prisma.college.create({
        data: {
          name: data.institutionName,
          isVerified: false,
          ...(locationId ? { locationId } : {}),
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.institutionName,
          email: data.officialEmail,
          passwordHash,
          role: 'COLLEGE_ADMIN',
          isVerified: false,
        },
      });
      await tx.notificationPreference.create({ data: { userId: user.id } });
      return user;
    });

    const token = this.generateToken(newUser.id, newUser.role);
    return { user: this.formatSafeUser(newUser), token };
  }

  public static async registerProfessional(data: RegisterProfessionalData): Promise<AuthResult> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      const error: any = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Prisma Transaction for User + ProfessionalProfile + NotificationPreference
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: 'PROFESSIONAL',
          phone: data.phone,
          isVerified: false,
          availableAsMentor: true,
        },
      });

      await tx.professionalProfile.create({
        data: {
          userId: user.id,
          company: data.company,
          jobTitle: data.jobTitle,
          githubUrl: data.githubUrl,
          linkedinUrl: data.linkedinUrl,
          employeeIdDocument: data.employeeIdDocument,
          verificationStatus: 'PENDING',
        },
      });

      await tx.notificationPreference.create({
        data: { userId: user.id },
      });

      return user;
    });

    const token = this.generateToken(newUser.id, newUser.role);
    return { user: this.formatSafeUser(newUser), token };
  }

  public static async loginUser(email: string, password: string): Promise<AuthResult> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            college: true,
            department: true,
          },
        },
        professionalProfile: true,
      },
    });

    if (!user) {
      const error: any = new Error('Invalid email address or password.');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    if (!user.isActive) {
      const error: any = new Error('Your account has been deactivated or suspended. Please contact platform support.');
      error.statusCode = 401;
      error.code = 'ACCOUNT_INACTIVE';
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error('Invalid email address or password.');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Update last login timestamp in PostgreSQL
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.generateToken(user.id, user.role);
    return {
      user: this.formatSafeUser(user),
      token,
    };
  }

  public static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        profileImage: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        studentProfile: {
          include: {
            college: true,
            department: true,
          },
        },
        professionalProfile: true,
      },
    });

    if (!user || !user.isActive) {
      const error: any = new Error('User session is invalid or user account is inactive.');
      error.statusCode = 401;
      error.code = 'INVALID_SESSION';
      throw error;
    }

    return user;
  }
}

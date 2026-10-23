import { prisma } from '../config/database';

export class ProfileService {
  public static calculateProfileCompletion(user: any, profile: any, skillsCount: number): number {
    const fields = [
      user.name,
      user.phone,
      user.profileImage,
      profile?.bio,
      profile?.githubUrl,
      profile?.linkedinUrl,
      profile?.collegeId || profile?.company,
      profile?.departmentId || profile?.jobTitle,
      profile?.locationId,
      skillsCount > 0 ? true : null,
    ];

    const filledCount = fields.filter((field) => field !== undefined && field !== null && field !== '').length;
    return Math.round((filledCount / fields.length) * 100);
  }

  public static async getStudentProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            college: true,
            department: true,
            location: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
        githubAnalysis: {
          orderBy: { analyzedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user || user.role !== 'STUDENT') {
      const error: any = new Error('Student profile record not found.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const profile = user.studentProfile;
    const skills = user.skills.map((us) => ({
      id: us.skill.id,
      name: us.skill.name,
      category: us.skill.category,
      proficiency: us.proficiency,
      source: us.source,
    }));

    const completion = this.calculateProfileCompletion(user, profile, skills.length);

    const parsedAnalytics = user.githubAnalysis && user.githubAnalysis.length > 0 
      ? JSON.parse(user.githubAnalysis[0].analysisData || '{}') 
      : null;
    const githubAnalytics = Array.isArray(parsedAnalytics) ? null : parsedAnalytics;

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
      college: profile?.college ? { id: profile.college.id, name: profile.college.name } : null,
      department: profile?.department ? { id: profile.department.id, name: profile.department.name } : null,
      yearOfStudy: profile?.yearOfStudy || 1,
      githubUrl: profile?.githubUrl || null,
      linkedinUrl: profile?.linkedinUrl || null,
      bio: profile?.bio || null,
      location: profile?.location
        ? { city: profile.location.city, state: profile.location.state, country: profile.location.country }
        : null,
      skills,
      profileCompletion: completion,
      githubAnalytics,
    };
  }

  public static async updateStudentProfile(userId: string, data: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    if (!user || user.role !== 'STUDENT') {
      const error: any = new Error('Student profile record not found.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    // Validate department belongs to college if both specified
    if (data.collegeId && data.departmentId) {
      const departmentRecord = await prisma.department.findFirst({
        where: {
          id: data.departmentId,
          collegeId: data.collegeId,
        },
      });

      if (!departmentRecord) {
        const error: any = new Error('The selected department does not belong to the specified college.');
        error.statusCode = 400;
        error.code = 'INVALID_DEPARTMENT_COLLEGE';
        throw error;
      }
    }

    await prisma.$transaction(async (tx) => {
      // Handle Location update/creation
      let locationId = user.studentProfile?.locationId;
      if (data.city || data.state || data.country) {
        if (locationId) {
          await tx.location.update({
            where: { id: locationId },
            data: {
              city: data.city || 'City',
              state: data.state || 'State',
              country: data.country || 'Country',
            },
          });
        } else {
          const newLoc = await tx.location.create({
            data: {
              latitude: 0,
              longitude: 0,
              city: data.city || 'City',
              state: data.state || 'State',
              country: data.country || 'Country',
            },
          });
          locationId = newLoc.id;
        }
      }

      if (data.name || data.mobile !== undefined || data.phone !== undefined) {
        await tx.user.update({
          where: { id: userId },
          data: {
            name: data.name || user.name,
            phone: data.mobile !== undefined ? data.mobile : (data.phone !== undefined ? data.phone : user.phone),
          }
        });
      }

      if (user.studentProfile) {
        await tx.studentProfile.update({
          where: { userId },
          data: {
            collegeId: data.collegeId || user.studentProfile.collegeId,
            departmentId: data.departmentId || user.studentProfile.departmentId,
            yearOfStudy: data.yearOfStudy || user.studentProfile.yearOfStudy,
            githubUrl: data.githubUrl !== undefined ? data.githubUrl : user.studentProfile.githubUrl,
            linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : user.studentProfile.linkedinUrl,
            bio: data.bio !== undefined ? data.bio : user.studentProfile.bio,
            locationId: locationId || user.studentProfile.locationId,
          },
        });
      }
    });

    return this.getStudentProfile(userId);
  }

  public static async getProfessionalProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        professionalProfile: {
          include: {
            location: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user || user.role !== 'PROFESSIONAL') {
      const error: any = new Error('Professional profile record not found.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const profile = user.professionalProfile;
    const skills = user.skills.map((us) => ({
      id: us.skill.id,
      name: us.skill.name,
      category: us.skill.category,
      proficiency: us.proficiency,
      source: us.source,
    }));

    const completion = this.calculateProfileCompletion(user, profile, skills.length);

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
      company: profile?.company || null,
      jobTitle: profile?.jobTitle || null,
      verificationStatus: profile?.verificationStatus || 'PENDING',
      githubUrl: profile?.githubUrl || null,
      linkedinUrl: profile?.linkedinUrl || null,
      bio: profile?.bio || null,
      location: profile?.location
        ? { city: profile.location.city, state: profile.location.state, country: profile.location.country }
        : null,
      skills,
      profileCompletion: completion,
    };
  }

  public static async updateProfessionalProfile(userId: string, data: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { professionalProfile: true },
    });

    if (!user || user.role !== 'PROFESSIONAL') {
      const error: any = new Error('Professional profile record not found.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    await prisma.$transaction(async (tx) => {
      let locationId = user.professionalProfile?.locationId;
      if (data.city || data.state || data.country) {
        if (locationId) {
          await tx.location.update({
            where: { id: locationId },
            data: {
              city: data.city || 'City',
              state: data.state || 'State',
              country: data.country || 'Country',
            },
          });
        } else {
          const newLoc = await tx.location.create({
            data: {
              latitude: 0,
              longitude: 0,
              city: data.city || 'City',
              state: data.state || 'State',
              country: data.country || 'Country',
            },
          });
          locationId = newLoc.id;
        }
      }

      if (data.name || data.mobile !== undefined || data.phone !== undefined) {
        await tx.user.update({
          where: { id: userId },
          data: {
            name: data.name || user.name,
            phone: data.mobile !== undefined ? data.mobile : (data.phone !== undefined ? data.phone : user.phone),
          }
        });
      }

      if (user.professionalProfile) {
        await tx.professionalProfile.update({
          where: { userId },
          data: {
            company: data.company || user.professionalProfile.company,
            jobTitle: data.jobTitle || user.professionalProfile.jobTitle,
            githubUrl: data.githubUrl !== undefined ? data.githubUrl : user.professionalProfile.githubUrl,
            linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : user.professionalProfile.linkedinUrl,
            bio: data.bio !== undefined ? data.bio : user.professionalProfile.bio,
            locationId: locationId || user.professionalProfile.locationId,
          },
        });
      }
    });

    return this.getProfessionalProfile(userId);
  }

  public static async updateUser(userId: string, data: any) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        profileImage: data.profileImage,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        profileImage: true,
        isActive: true,
        isVerified: true,
      },
    });

    return updatedUser;
  }

  public static async getPublicUserProfile(targetUserId: string) {
    let user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        role: true,
        profileImage: true,
        isActive: true,
        studentProfile: {
          include: {
            college: { select: { name: true } },
            department: { select: { name: true } },
          },
        },
        professionalProfile: {
          select: {
            company: true,
            jobTitle: true,
            verificationStatus: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
        githubAnalysis: {
          orderBy: { analyzedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      user = await prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          role: true,
          profileImage: true,
          isActive: true,
          studentProfile: {
            include: {
              college: { select: { name: true } },
              department: { select: { name: true } },
            },
          },
          professionalProfile: {
            select: {
              company: true,
              jobTitle: true,
              verificationStatus: true,
            },
          },
          skills: {
            include: {
              skill: true,
            },
          },
          githubAnalysis: {
            orderBy: { analyzedAt: 'desc' },
            take: 1,
          },
        },
      });
    }

    if (!user || !user.isActive) {
      const error: any = new Error('User profile not found or user account is inactive.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const parsedPublicAnalytics = user.githubAnalysis && user.githubAnalysis.length > 0 
      ? JSON.parse(user.githubAnalysis[0].analysisData || '{}') 
      : null;
    const githubAnalytics = Array.isArray(parsedPublicAnalytics) ? null : parsedPublicAnalytics;

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      profileImage: user.profileImage,
      college: user.studentProfile?.college?.name || null,
      department: user.studentProfile?.department?.name || null,
      company: user.professionalProfile?.company || null,
      jobTitle: user.professionalProfile?.jobTitle || null,
      skills: user.skills.map((us) => ({
        id: us.skill.id,
        name: us.skill.name,
        category: us.skill.category,
        proficiency: us.proficiency,
      })),
      githubAnalytics,
    };
  }

  public static async getUserSkills(userId: string) {
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
      },
    });

    return userSkills.map((us) => ({
      id: us.skill.id,
      name: us.skill.name,
      category: us.skill.category,
      proficiency: us.proficiency,
      source: us.source,
      confidence: us.confidence,
    }));
  }
}

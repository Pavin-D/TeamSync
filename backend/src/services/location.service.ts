import { prisma } from '../config/database';

export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

export class LocationService {
  public static async updateUserLocation(userId: string, data: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: { include: { location: true } },
        professionalProfile: { include: { location: true } },
      },
    });

    if (!user) {
      const error: any = new Error('User record not found.');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // 1. Create or update location record
    let locationId = user.studentProfile?.locationId || user.professionalProfile?.locationId;

    if (locationId) {
      await prisma.location.update({
        where: { id: locationId },
        data: {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city || 'Chennai',
          state: data.state || 'Tamil Nadu',
          country: data.country || 'India',
        },
      });
    } else {
      const newLoc = await prisma.location.create({
        data: {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city || 'Chennai',
          state: data.state || 'Tamil Nadu',
          country: data.country || 'India',
        },
      });
      locationId = newLoc.id;

      if (user.role === 'STUDENT' && user.studentProfile) {
        await prisma.studentProfile.update({
          where: { userId },
          data: { locationId },
        });
      } else if (user.role === 'PROFESSIONAL' && user.professionalProfile) {
        await prisma.professionalProfile.update({
          where: { userId },
          data: { locationId },
        });
      }
    }

    // 2. Update user location timestamp & preferences
    await prisma.user.update({
      where: { id: userId },
      data: {
        locationUpdatedAt: new Date(),
        availableForTeamFormation: data.availableForTeamFormation !== undefined ? data.availableForTeamFormation : user.availableForTeamFormation,
        availableAsMentor: data.availableAsMentor !== undefined ? data.availableAsMentor : user.availableAsMentor,
        showLocationForDiscovery: data.showLocationForDiscovery !== undefined ? data.showLocationForDiscovery : user.showLocationForDiscovery,
      },
    });

    return {
      message: 'Location updated successfully.',
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city || 'Chennai',
      updatedAt: new Date().toISOString(),
    };
  }

  public static async getUserLocation(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: { include: { location: true } },
        professionalProfile: { include: { location: true } },
      },
    });

    if (!user) {
      const error: any = new Error('User not found.');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const location = user.studentProfile?.location || user.professionalProfile?.location;

    return {
      userId: user.id,
      latitude: location?.latitude || null,
      longitude: location?.longitude || null,
      city: location?.city || null,
      country: location?.country || null,
      availableForTeamFormation: user.availableForTeamFormation,
      availableAsMentor: user.availableAsMentor,
      showLocationForDiscovery: user.showLocationForDiscovery,
      locationUpdatedAt: user.locationUpdatedAt ? user.locationUpdatedAt.toISOString() : null,
    };
  }

  public static async getNearbyDiscovery(currentUserId: string, queryParams: any) {
    const radiusKm = queryParams.radius || 10;
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 20;
    const skip = (page - 1) * limit;

    // 1. Get current requesting user's stored location
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        studentProfile: { include: { location: true } },
        professionalProfile: { include: { location: true } },
      },
    });

    const currentLoc = currentUser?.studentProfile?.location || currentUser?.professionalProfile?.location;

    if (!currentLoc) {
      return {
        users: [],
        pagination: { page, limit, total: 0, totalPages: 1 },
        message: 'Location unavailable. Please grant location permission to discover nearby teammates.',
      };
    }

    // 2. Query potential candidates from PostgreSQL
    const candidateUsers = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        isActive: true,
        showLocationForDiscovery: true,
        ...(queryParams.type === 'student' ? { role: 'STUDENT' } : {}),
        ...(queryParams.type === 'professional' ? { role: 'PROFESSIONAL' } : {}),
        ...(queryParams.type === 'mentor' ? { availableAsMentor: true } : {}),
        ...(queryParams.availableForTeamFormation !== undefined ? { availableForTeamFormation: queryParams.availableForTeamFormation } : {}),
      },
      include: {
        studentProfile: { include: { college: true, department: true, location: true } },
        professionalProfile: { include: { location: true } },
        skills: { include: { skill: true } },
      },
    });

    // 3. Calculate Haversine spatial distance for candidates
    const nearbyList = candidateUsers
      .map((u) => {
        const uLoc = u.studentProfile?.location || u.professionalProfile?.location;
        if (!uLoc) return null;

        const distanceKm = calculateHaversineDistanceKm(
          currentLoc.latitude,
          currentLoc.longitude,
          uLoc.latitude,
          uLoc.longitude
        );

        if (distanceKm > radiusKm) return null;

        // Apply college/department filters if specified
        if (queryParams.collegeId && u.studentProfile?.collegeId !== queryParams.collegeId) return null;
        if (queryParams.departmentId && u.studentProfile?.departmentId !== queryParams.departmentId) return null;

        // Apply skill filter if specified
        if (queryParams.skill) {
          const hasSkill = u.skills.some(
            (s) => s.skill.name.toLowerCase() === queryParams.skill.toLowerCase()
          );
          if (!hasSkill) return null;
        }

        // Privacy boundary: Strictly omit latitude/longitude
        return {
          id: u.id,
          name: u.name,
          role: u.role,
          profileImage: u.profileImage,
          college: u.studentProfile?.college?.name || u.professionalProfile?.company || 'TeamSync Member',
          department: u.studentProfile?.department?.name || u.professionalProfile?.jobTitle || 'Member',
          company: u.professionalProfile?.company || null,
          jobTitle: u.professionalProfile?.jobTitle || null,
          skills: u.skills.map((s) => s.skill.name),
          distanceKm,
          city: uLoc.city || 'Nearby',
          approximateArea: uLoc.city || 'Nearby',
          approximateLat: uLoc.latitude,
          approximateLng: uLoc.longitude,
          availableForTeamFormation: u.availableForTeamFormation,
          availableAsMentor: u.availableAsMentor,
        };
      })
      .filter(Boolean) as any[];

    // 4. Sort nearest to farthest
    nearbyList.sort((a, b) => a.distanceKm - b.distanceKm);

    // 5. Apply server-side pagination
    const total = nearbyList.length;
    const paginated = nearbyList.slice(skip, skip + limit);

    return {
      users: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

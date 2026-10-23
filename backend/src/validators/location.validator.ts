import { z } from 'zod';

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90 degrees'),
  longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180 degrees'),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  availableForTeamFormation: z.boolean().optional(),
  availableAsMentor: z.boolean().optional(),
  showLocationForDiscovery: z.boolean().optional(),
});

export const nearbyDiscoveryQuerySchema = z.object({
  radius: z.string().transform((val) => Math.min(Math.max(parseInt(val, 10) || 10, 1), 100)).default('10'),
  type: z.enum(['student', 'professional', 'mentor', 'all']).default('all'),
  collegeId: z.string().optional(),
  departmentId: z.string().optional(),
  skill: z.string().optional(),
  availableForTeamFormation: z.string().transform((val) => val === 'true').optional(),
  page: z.string().transform((val) => parseInt(val, 10) || 1).optional(),
  limit: z.string().transform((val) => Math.min(parseInt(val, 10) || 20, 50)).optional(),
});

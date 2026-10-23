import { z } from 'zod';

export const createReportSchema = z.object({
  reportedUserId: z.string().uuid('Invalid reported user ID'),
  teamId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
  reason: z.enum([
    'NON_PARTICIPATION',
    'TEAM_ABANDONMENT',
    'MISREPRESENTED_SKILLS',
    'MISCONDUCT',
    'HARASSMENT',
    'UNPROFESSIONAL_BEHAVIOR',
    'OTHER',
  ]),
  description: z
    .string()
    .min(15, 'Report description must be at least 15 characters long for investigation purposes')
    .max(2000, 'Description cannot exceed 2000 characters'),
});

export const reviewReportSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  resolution: z
    .enum(['CONFIRMED', 'DISMISSED', 'WARNING', 'ACCOUNT_RESTRICTED', 'ACCOUNT_SUSPENDED', 'ACCOUNT_DELETED'])
    .optional(),
  adminNotes: z.string().optional(),
});

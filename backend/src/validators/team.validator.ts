import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  description: z.string().optional(),
  eventId: z.string().optional(),
  maxMembers: z.preprocess((val) => (val ? Number(val) : 4), z.number().min(2).max(20)).optional(),
  maximumMembers: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  scope: z.string().optional(),
  requiredSkills: z.union([z.string(), z.array(z.string())]).optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  recruitmentOpen: z.boolean().optional(),
  requiredSkills: z.string().optional(),
});

export const joinRequestSchema = z.object({
  message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
});

export const invitationSchema = z.object({
  userId: z.string().uuid('Invalid User ID'),
  message: z.string().optional(),
});

export const leadTransferSchema = z.object({
  newTeamLeadId: z.string().uuid('Invalid New Team Lead User ID'),
});

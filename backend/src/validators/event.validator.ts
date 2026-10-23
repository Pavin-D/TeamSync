import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  organizer: z.string().min(2, 'Organizer name is required'),
  startDate: z.string().datetime({ message: 'Invalid start date format' }),
  endDate: z.string().datetime({ message: 'Invalid end date format' }),
  registrationDeadline: z.string().datetime({ message: 'Invalid registration deadline format' }),
  location: z.string().optional(),
  mode: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']).default('ONLINE'),
  minTeamSize: z.number().min(1, 'Minimum team size must be at least 1').default(2),
  maxTeamSize: z.number().min(1, 'Maximum team size must be at least 1').default(4),
  registrationUrl: z.string().url('Invalid registration URL').optional().or(z.literal('')),
  allowsStudents: z.boolean().default(true),
  allowsProfessionals: z.boolean().default(true),
  allowsCrossCollegeTeams: z.boolean().default(true),
  scope: z.enum(['COLLEGE', 'GLOBAL']).optional().default('GLOBAL'),
  collegeId: z.string().optional(),
});

export const updateEventSchema = createEventSchema.partial().extend({
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
});

export const eventQuerySchema = z.object({
  search: z.string().optional(),
  mode: z.string().optional(),
  status: z.string().optional(),
  scope: z.string().optional(),
  domain: z.string().optional(),
  teamSize: z.string().optional(),
  city: z.string().optional(),
  eligibility: z.string().optional(),
  deadline: z.string().optional(),
  allowsStudents: z.union([z.string(), z.boolean()]).optional(),
  allowsProfessionals: z.union([z.string(), z.boolean()]).optional(),
  allowsCrossCollegeTeams: z.union([z.string(), z.boolean()]).optional(),
  page: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number().default(1)).optional(),
  limit: z.preprocess((val) => (typeof val === 'string' ? parseInt(val, 10) : val), z.number().default(10)).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
});

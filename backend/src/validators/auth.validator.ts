import { z } from 'zod';

export const studentRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').transform((val) => val.toLowerCase().trim()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional().nullable(),
  college: z.string().min(1, 'College name or ID is required'),
  department: z.string().min(1, 'Department is required'),
  yearOfStudy: z.preprocess((val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const parsed = parseInt(val.replace(/\D/g, ''), 10);
      return isNaN(parsed) ? 1 : Math.min(Math.max(parsed, 1), 5);
    }
    return 1;
  }, z.number().min(1).max(5).default(1)),
  githubUrl: z.string().url('Invalid GitHub URL').optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
});

export const professionalRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').transform((val) => val.toLowerCase().trim()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional().nullable(),
  company: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  githubUrl: z.string().url('Invalid GitHub URL').optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
  employeeIdDocument: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').transform((val) => val.toLowerCase().trim()),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').transform((val) => val.toLowerCase().trim()),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

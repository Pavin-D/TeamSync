import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional().nullable(),
  phone: z.string().optional().nullable(),
  profileImage: z.string().url('Invalid image URL').optional().nullable().or(z.literal('')),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional().nullable(),
});

export const updateStudentProfileSchema = z.object({
  name: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  collegeId: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
  yearOfStudy: z.coerce.number().min(1).max(5).optional().nullable(),
  githubUrl: z.string().url('Invalid GitHub URL').optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});

export const updateProfessionalProfileSchema = z.object({
  name: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().min(1, 'Company name is required').optional().nullable(),
  jobTitle: z.string().min(1, 'Job title is required').optional().nullable(),
  githubUrl: z.string().url('Invalid GitHub URL').optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().nullable().or(z.literal('')),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});

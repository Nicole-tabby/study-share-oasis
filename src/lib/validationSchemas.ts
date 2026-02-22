import { z } from 'zod';

export const NoteSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be under 200 characters'),
  course: z.string().trim().min(1, 'Course is required').max(100, 'Course must be under 100 characters'),
  semester: z.string().trim().min(1, 'Semester is required').max(50, 'Semester must be under 50 characters'),
  description: z.string().max(2000, 'Description must be under 2000 characters').optional().nullable(),
  file_name: z.string().min(1).max(255),
});

export const ProfileSchema = z.object({
  full_name: z.string().max(100, 'Name must be under 100 characters').optional().nullable(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional().nullable(),
  university: z.string().max(200, 'University must be under 200 characters').optional().nullable(),
  course: z.string().max(100, 'Course must be under 100 characters').optional().nullable(),
  year: z.string().max(20, 'Year must be under 20 characters').optional().nullable(),
});

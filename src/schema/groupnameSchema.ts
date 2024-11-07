import { z } from 'zod';

export const groupnameValidation = z
  .string()
  .min(3, 'Group name must be at least 3 characters')
  .max(20, 'Group name must be no more than 20 characters')
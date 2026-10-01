import { z } from 'zod';
import { UserResponseSchema } from './auth.js';

export const UsersListResponseSchema = z.array(UserResponseSchema);
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
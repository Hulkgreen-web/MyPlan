import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  name: z.string().min(2, "Le nom est trop court"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const RegisterSchema = UserSchema.pick({
  email: true,
  password: true,
  name: true
});

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true
});

export const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
});

export const MessageResponseSchema = z.object({
  message: z.string(),
});

export const LoginResponseSchema = z.object({
  message: z.string(),
  user: UserResponseSchema,
  accessToken: z.string(),
});

export const RefreshResponseSchema = z.object({
  user: UserResponseSchema,
  accessToken: z.string(),
});

export const MeResponseSchema = z.object({
  user: UserResponseSchema,
});

export type User = z.infer<typeof UserSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
}

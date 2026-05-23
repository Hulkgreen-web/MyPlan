import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  name: z.string().min(2, "Le nom est trop court"),
  createdAt: z.date(),
  updatedAt: z.date()
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

export type User = z.infer<typeof UserSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
}

import { UseFormReturn } from "react-hook-form";
import z from "zod";

export type UseLoginForm = UseFormReturn<LoginFormsSchema>;
export type UseRegisterForm = UseFormReturn<RegisterFormsSchema>;

export type LoginFormsSchema = z.infer<typeof login_validation>;
export type RegisterFormsSchema = z.infer<typeof register_validation>;

const login_validation = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(8).max(64),
});

const register_validation = z.object({
  login_validation,
  first_name: z.string().nonempty(),
  last_name: z.string().nonempty(),
  user_type: z.string().max(1).nonempty(),
});

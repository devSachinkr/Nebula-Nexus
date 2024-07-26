import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(5, { message: "Password at least greater than 5 characters" }),
});

export const SignUpSchema = z
  .object({
    email: z.string().describe("email").email({ message: "Invalid email" }),
    password: z
      .string()
      .min(5, { message: "Password at least greater than 5 characters" }),
    confirmPassword: z
      .string()
      .min(5, { message: "Password must be than 5 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export const workspaceFormSchema = z.object({
  workspaceLogo: z.any(),
  workspaceName: z
    .string()
    .min(5, { message: "Workspace name must be greater than 5 characters" }),
});

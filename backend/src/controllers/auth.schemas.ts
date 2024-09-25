import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(4).max(20),
  password: z.string().min(6).max(255),
  userAgent: z.string().optional()
})

export const registerSchema = z.object({
  username: z.string().min(4).max(20),
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
  confirmPassword: z.string().min(6).max(255),
  userAgent: z.string().optional()
}).refine(
  (data) => data.password === data.confirmPassword , {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  }
)


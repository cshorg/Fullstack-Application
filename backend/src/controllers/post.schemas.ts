import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(4).max(40),
  content: z.string().min(1).max(400)
})

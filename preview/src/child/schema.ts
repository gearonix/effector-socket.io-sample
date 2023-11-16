import { z } from 'zod'

export const postsSchema = z.array(
  z.object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number()
  })
)

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NOTION_TOKEN: z.string().min(1, 'NOTION_TOKEN is required'),
  NOTION_DATABASE_ID: z.string().min(1, 'NOTION_DATABASE_ID is required'),
  NOTION_ITEMS_DATABASE_ID: z
    .string()
    .min(1, 'NOTION_ITEMS_DATABASE_ID is required'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  // 관리자 인증 (서버 전용)
  ADMIN_ID: z.string().min(1, 'ADMIN_ID is required'),
  ADMIN_PASSWORD: z.string().min(1, 'ADMIN_PASSWORD is required'),
  SESSION_SECRET: z
    .string()
    .min(32, 'SESSION_SECRET must be at least 32 characters'),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  NOTION_ITEMS_DATABASE_ID: process.env.NOTION_ITEMS_DATABASE_ID,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  ADMIN_ID: process.env.ADMIN_ID,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET,
})

export type Env = z.infer<typeof envSchema>

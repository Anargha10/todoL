import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);

export const ALLOWED_ORIGINS = env.NODE_ENV === 'development'
  ? ['http://localhost:5173', 'https://localhost:5173']
  : env.CORS_ORIGIN.split(',').map((o) => o.trim());

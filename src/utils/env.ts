/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string().default("postgres://user:password@127.0.0.1:5432/postgres"),
  REDIS_URL: z.string().default("redis://127.0.0.1:6379/"),
  APP_KEY: z.string().default("secret"),
  APP_ENCRYPTION_KEY: z.string().default("secret"),
  PORT: z.coerce.number().default(8080),
  HOST: z.string().default("127.0.0.1"),
});

export const env = envSchema.parse(process.env);

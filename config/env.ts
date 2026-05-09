import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),

  // TODO(auth): Require strong server-only secrets before enabling authentication.
  AUTH_SECRET: z.string().min(32).optional(),

  // TODO(database): Validate provider-specific connection strings when persistence is introduced.
  DATABASE_URL: z.url().optional(),

  // TODO(payments): Keep payment provider secrets server-only and never prefix with NEXT_PUBLIC_.
  STRIPE_SECRET_KEY: z.string().optional(),

  // TODO(analytics): Route analytics through a privacy-aware server or consent-aware client adapter.
  ANALYTICS_WRITE_KEY: z.string().optional()
});

const parsedEnv = serverEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration", z.treeifyError(parsedEnv.error));
  throw new Error("Invalid environment configuration");
}

export const env = parsedEnv.data;

export const publicEnv = {
  appUrl: env.NEXT_PUBLIC_APP_URL
} as const;

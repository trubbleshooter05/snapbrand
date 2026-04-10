/**
 * Production env checks for deploy/runtime (Vercel sets VERCEL=1).
 * Local dev/build: set SKIP_ENV_VALIDATION=1 if you need to run without full secrets.
 */
export function validateEnvAtStartup(): void {
  if (process.env.SKIP_ENV_VALIDATION === "1") return;
  if (process.env.VERCEL !== "1") return;

  const required = ["DATABASE_URL", "NEXTAUTH_SECRET"] as const;
  const missing = required.filter((k) => !process.env[k]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

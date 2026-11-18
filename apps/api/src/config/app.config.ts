export const appConfig = {
  port: Number(process.env.API_PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};

export const dbConfig = {
  url:
    process.env.POSTGRES_URL ||
    "postgresql://photo:photo@localhost:5432/photo",
};

export const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

export const queueConfig = {
  prefix: "photo_portfolio",
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
};

export const r2Config = {
  accountId: process.env.R2_ACCOUNT_ID || "",
  accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  bucket: process.env.R2_BUCKET || "photo-portfolio",
  region: process.env.R2_REGION || "auto",
};

export const turnstileConfig = {
  siteKey: process.env.TURNSTILE_SITE_KEY || "",
  secretKey: process.env.TURNSTILE_SECRET_KEY || "",
};

export const contactConfig = {
  fromEmail: process.env.CONTACT_FROM_EMAIL || "",
  fromName: process.env.CONTACT_FROM_NAME || "Patricio Betancourt",
};

export const securityConfig = {
  sessionInactiveExpiryMs: 30 * 60 * 1000,
  sessionAbsoluteExpiryMs: 12 * 60 * 60 * 1000,
  recoveryCodeCount: 10,
  rateLimitContactPerHour: 3,
};

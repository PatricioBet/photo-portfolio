export const appConfig = {
  port: Number(process.env.API_PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};

export const dbConfig = {
  url:
    process.env.POSTGRES_URL ||
    "postgresql://patriciobet:patriciobet@localhost:5432/photo",
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

export const storageConfig = {
  localPath: process.env.LOCAL_STORAGE_PATH || "/data/media",
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

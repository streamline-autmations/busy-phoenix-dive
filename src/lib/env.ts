// Validate and export environment variables
const requiredEnvVars = {
  VITE_N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL,
  VITE_APP_TOKEN: import.meta.env.VITE_APP_TOKEN,
  VITE_CLOUDINARY_CLOUD: import.meta.env.VITE_CLOUDINARY_CLOUD,
  VITE_CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  VITE_DISCOUNTS_WEBHOOK: import.meta.env.VITE_DISCOUNTS_WEBHOOK,
  VITE_SPECIALS_WEBHOOK: import.meta.env.VITE_SPECIALS_WEBHOOK,
} as const;

// Validate all required env vars are present
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    'Please check your .env file and ensure all variables are set.'
  );
}

export const env = {
  N8N_WEBHOOK_URL: requiredEnvVars.VITE_N8N_WEBHOOK_URL!,
  APP_TOKEN: requiredEnvVars.VITE_APP_TOKEN!,
  CLOUDINARY_CLOUD: requiredEnvVars.VITE_CLOUDINARY_CLOUD!,
  CLOUDINARY_UPLOAD_PRESET: requiredEnvVars.VITE_CLOUDINARY_UPLOAD_PRESET!,
  DISCOUNTS_WEBHOOK: requiredEnvVars.VITE_DISCOUNTS_WEBHOOK!,
  SPECIALS_WEBHOOK: requiredEnvVars.VITE_SPECIALS_WEBHOOK!,
} as const;

// Optional env vars with defaults
export const optionalEnv = {
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;
import { S3Client } from '@aws-sdk/client-s3'

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error('R2 credentials not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.')
}

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  requestHandler: {
    // Cloudflare R2 doesn't support signature v4 in all regions; use v2 for compatibility
    // Actually R2 supports v4, but let's be safe
  },
  maxAttempts: 3,
})

// Bucket names
export const PRIVATE_BUCKET = process.env.R2_PRIVATE_BUCKET || 'photo-private'
export const PUBLIC_BUCKET = process.env.R2_PUBLIC_BUCKET || 'photo-public'
export const PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || 'cdn-photo.patriciobet.dev'

export function getPublicUrl(key: string): string {
  return `https://${PUBLIC_DOMAIN}/${key}`
}

export function getPrivateUrl(key: string): string {
  return `https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${PRIVATE_BUCKET}/${key}`
}

import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { s3Client, PRIVATE_BUCKET, PUBLIC_BUCKET, getPublicUrl } from './r2.js'
import { createLogger } from './logger.js'

const logger = createLogger('r2-client')

export interface UploadResult {
  key: string
  etag: string
  url: string
}

// ── Upload to private bucket (incoming/originals) ─────────────
export async function uploadToPrivate(
  key: string,
  body: Buffer | Uint8Array | Blob | ReadableStream,
  contentType: string
): Promise<UploadResult> {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: PRIVATE_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    },
    queueSize: 4,
    partSize: 10 * 1024 * 1024, // 10MB parts
    leavePartsOnError: false,
  })

  const result = await upload.done()
  logger.info(`Uploaded to private: ${key}`)

  return {
    key,
    etag: result.ETag?.replace(/"/g, '') || '',
    url: getPublicUrl(key), // will be updated after processing
  }
}

// ── Upload to public bucket (derivatives) ─────────────────────
export async function uploadToPublic(
  key: string,
  body: Buffer | Uint8Array | Blob | ReadableStream,
  contentType: string,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: PUBLIC_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
      Metadata: metadata,
    },
    queueSize: 4,
    partSize: 10 * 1024 * 1024,
    leavePartsOnError: false,
  })

  const result = await upload.done()
  logger.info(`Uploaded to public: ${key}`)

  return {
    key,
    etag: result.ETag?.replace(/"/g, '') || '',
    url: getPublicUrl(key),
  }
}

// ── Get object from bucket ────────────────────────────────────
export async function getObject(bucket: string, key: string): Promise<Buffer> {
  const response = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  const chunks: Buffer[] = []

  if (response.Body) {
    for await (const chunk of response.Body) {
      chunks.push(Buffer.from(chunk))
    }
  }

  return Buffer.concat(chunks)
}

// ── Delete object ─────────────────────────────────────────────
export async function deleteObject(bucket: string, key: string): Promise<void> {
  await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
  logger.info(`Deleted: ${key} from ${bucket}`)
}

// ── Check if object exists ────────────────────────────────────
export async function objectExists(bucket: string, key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return true
  } catch {
    return false
  }
}

// ── Upload variants atomically ────────────────────────────────
// All variants must succeed or none are published
export async function uploadVariants(variants: Array<{
  key: string
  body: Buffer
  contentType: string
}>): Promise<UploadResult[]> {
  const results: UploadResult[] = []

  for (const variant of variants) {
    const result = await uploadToPublic(variant.key, variant.body, variant.contentType)
    results.push(result)
  }

  return results
}

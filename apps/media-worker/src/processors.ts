import { Job } from 'bullmq'
import { createLogger } from './logger.js'
import { s3Client, PRIVATE_BUCKET, getObject } from './r2.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { processPhoto, ImageVariants } from './image-processor.js'
import { uploadVariants } from './r2-client.js'
import { validateVideo, transcodeVideo, generatePosters, generateHoverPreview, generateLoop, VideoInfo } from './video-processor.js'
import { createHash } from 'crypto'
import { mkdirSync, existsSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const logger = createLogger('job-processor')

// ── Job data interfaces ───────────────────────────────────────
export interface PhotoJobData {
  type: 'process-photo'
  id: string
  originalKey: string
  mimeType: string
  fileSize: number
}

export interface VideoJobData {
  type: 'process-video'
  id: string
  originalKey: string
  mimeType: string
  fileSize: number
}

export interface VariantsJobData {
  type: 'generate-variants'
  id: string
  originalKey: string
}

// ── Download from R2 ──────────────────────────────────────────
async function downloadFromR2(key: string): Promise<Buffer> {
  logger.info(`Downloading from R2: ${key}`)
  const response = await s3Client.send(new GetObjectCommand({
    Bucket: PRIVATE_BUCKET,
    Key: key,
  }))

  const chunks: Buffer[] = []
  if (response.Body) {
    for await (const chunk of response.Body) {
      chunks.push(Buffer.from(chunk))
    }
  }

  return Buffer.concat(chunks)
}

// ── Process photo job ─────────────────────────────────────────
export async function processPhotoJob(job: Job<PhotoJobData>): Promise<void> {
  const { id, originalKey, mimeType } = job.data

  logger.info(`Processing photo job ${id}: ${originalKey}`)

  // Create a unique temp directory for this job
  const tempDir = join(tmpdir(), `worker-${id}-${Date.now()}`)
  mkdirSync(tempDir, { recursive: true })

  try {
    // Download original from R2
    const input = await downloadFromR2(originalKey)

    // Validate magic bytes (basic polyglot detection)
    validateImageMagicBytes(input)

    // Process with Sharp
    const variants: ImageVariants = await processPhoto(input, originalKey)

    // Upload all variants atomically
    const allVariants = [
      ...variants.originals,
      variants.social,
    ]
    await uploadVariants(allVariants)

    logger.info(`Photo job ${id} complete: ${allVariants.length} variants uploaded`)
  } catch (err) {
    logger.error(`Photo job ${id} failed: ${err}`)
    throw err
  } finally {
    // Clean up temp files
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }
}

// ── Process video job ─────────────────────────────────────────
export async function processVideoJob(job: Job<VideoJobData>): Promise<void> {
  const { id, originalKey, mimeType } = job.data

  logger.info(`Processing video job ${id}: ${originalKey}`)

  const tempDir = join(tmpdir(), `worker-${id}-${Date.now()}`)
  mkdirSync(tempDir, { recursive: true })

  try {
    // Download original
    const input = await downloadFromR2(originalKey)
    const inputPath = join(tempDir, 'input.mp4')
    import('fs').then(({ writeFileSync }) => writeFileSync(inputPath, input))

    // Validate with ffprobe
    const videoInfo: VideoInfo = await validateVideo(inputPath)

    // Transcode to multiple resolutions
    const transcodes = await transcodeVideo(inputPath, tempDir, videoInfo)

    // Generate posters
    const posters = await generatePosters(inputPath, tempDir, videoInfo.duration)

    // Generate hover preview
    const preview = await generateHoverPreview(inputPath, tempDir, videoInfo.duration)

    // Generate loop for hero
    const loop = await generateLoop(inputPath, tempDir, videoInfo.duration)

    // Upload all results
    const uploadPromises: Promise<void>[] = []

    for (const t of transcodes) {
      const data = import('fs').then(({ readFileSync }) => readFileSync(t.path))
      uploadPromises.push(
        import('./r2-client.js').then(({ uploadToPublic }) =>
          data.then((buf) => uploadToPublic(t.key, buf, 'video/mp4'))
        )
      )
    }

    for (const p of posters) {
      const data = import('fs').then(({ readFileSync }) => readFileSync(p.path))
      uploadPromises.push(
        import('./r2-client.js').then(({ uploadToPublic }) =>
          data.then((buf) => uploadToPublic(p.key, buf, 'image/avif'))
        )
      )
    }

    if (preview) {
      const data = import('fs').then(({ readFileSync }) => readFileSync(preview.path))
      uploadPromises.push(
        import('./r2-client.js').then(({ uploadToPublic }) =>
          data.then((buf) => uploadToPublic(preview.key, buf, 'video/mp4'))
        )
      )
    }

    if (loop) {
      const data = import('fs').then(({ readFileSync }) => readFileSync(loop.path))
      uploadPromises.push(
        import('./r2-client.js').then(({ uploadToPublic }) =>
          data.then((buf) => uploadToPublic(loop.key, buf, 'video/mp4'))
        )
      )
    }

    await Promise.all(uploadPromises)

    logger.info(`Video job ${id} complete: ${transcodes.length} transcodes, ${posters.length} posters`)
  } catch (err) {
    logger.error(`Video job ${id} failed: ${err}`)
    throw err
  } finally {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true })
    }
  }
}

// ── Generate variants job (reprocessing) ──────────────────────
export async function generateVariantsJob(job: Job<VariantsJobData>): Promise<void> {
  const { id, originalKey } = job.data

  logger.info(`Generating variants for ${id}: ${originalKey}`)

  // This job is for reprocessing with new settings
  // It follows the same flow as process-photo but can be extended
  // with new format/quality options
  await processPhotoJob(job as unknown as Job<PhotoJobData>)
}

// ── Magic byte validation ─────────────────────────────────────
function validateImageMagicBytes(data: Buffer): void {
  // JPEG: FF D8 FF
  if (data.length >= 3 && data[0] === 0xFF && data[1] === 0xD8 && data[2] === 0xFF) {
    return
  }
  // PNG: 89 50 4E 47
  if (data.length >= 4 && data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47) {
    return
  }
  // WebP: 52 49 46 46 ... 57 45 42 50
  if (data.length >= 12 && data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46 && data[8] === 0x57 && data[9] === 0x45 && data[10] === 0x42 && data[11] === 0x50) {
    return
  }
  // AVIF: check for ftyp box
  if (data.length >= 12 && data[4] === 0x66 && data[5] === 0x74 && data[6] === 0x79 && data[7] === 0x70) {
    return
  }

  throw new Error('Invalid image file: magic bytes do not match any supported format')
}

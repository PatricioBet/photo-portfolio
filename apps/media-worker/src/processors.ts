import { Job } from 'bullmq'
import { createLogger } from './logger.js'
import { uploadFile, downloadFile, deleteFile } from './storage.js'
import { processPhoto, ImageVariants } from './image-processor.js'
import { validateVideo, transcodeVideo, generatePosters, generateHoverPreview, generateLoop, VideoInfo } from './video-processor.js'
import { createHash } from 'crypto'
import { mkdirSync, existsSync, rmSync, readFileSync } from 'fs'
import { join } from 'path'

const logger = createLogger('job-processor')

// ── Job data interfaces ───────────────────────────────────────
export interface PhotoJobData {
  type: 'process-photo'
  id: string
  filePath: string
}

export interface VideoJobData {
  type: 'process-video'
  id: string
  filePath: string
}

// ── Process photo job ─────────────────────────────────────────
export async function processPhotoJob(job: Job<PhotoJobData>): Promise<void> {
  const { id, filePath } = job.data

  logger.info(`Processing photo job ${id}: ${filePath}`)

  try {
    // Read original from local storage
    const input = downloadFile(filePath)

    // Validate magic bytes (basic polyglot detection)
    validateImageMagicBytes(input)

    // Process with Sharp
    const variants: ImageVariants = await processPhoto(input, filePath)

    // Upload all variants to local storage
    const allVariants = [
      ...variants.originals,
      variants.social,
    ]
    for (const variant of allVariants) {
      uploadFile(variant.key, variant.body)
      logger.info(`Uploaded variant: ${variant.key}`)
    }

    logger.info(`Photo job ${id} complete: ${allVariants.length} variants saved`)
  } catch (err) {
    logger.error(`Photo job ${id} failed: ${err}`)
    throw err
  }
}

// ── Process video job ─────────────────────────────────────────
export async function processVideoJob(job: Job<VideoJobData>): Promise<void> {
  const { id, filePath } = job.data

  logger.info(`Processing video job ${id}: ${filePath}`)

  try {
    // Read original from local storage
    const input = downloadFile(filePath)
    const inputPath = join('/tmp', `input-${id}.mp4`)
    uploadFile(filePath, input) // ensure it's in storage path

    // Validate with ffprobe
    const videoInfo: VideoInfo = await validateVideo(filePath)

    // Transcode to multiple resolutions
    const tempDir = join('/tmp', `worker-${id}`)
    mkdirSync(tempDir, { recursive: true })

    const transcodes = await transcodeVideo(filePath, tempDir, videoInfo)

    // Generate posters
    const posters = await generatePosters(filePath, tempDir, videoInfo.duration)

    // Generate hover preview
    const preview = await generateHoverPreview(filePath, tempDir, videoInfo.duration)

    // Generate loop for hero
    const loop = await generateLoop(filePath, tempDir, videoInfo.duration)

    // Upload all results
    for (const t of transcodes) {
      const data = readFileSync(t.path)
      uploadFile(t.key, data)
      logger.info(`Uploaded transcode: ${t.key}`)
    }

    for (const p of posters) {
      const data = readFileSync(p.path)
      uploadFile(p.key, data)
      logger.info(`Uploaded poster: ${p.key}`)
    }

    if (preview) {
      const data = readFileSync(preview.path)
      uploadFile(preview.key, data)
      logger.info(`Uploaded preview: ${preview.key}`)
    }

    if (loop) {
      const data = readFileSync(loop.path)
      uploadFile(loop.key, data)
      logger.info(`Uploaded loop: ${loop.key}`)
    }

    // Clean up temp files
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true })
    }

    logger.info(`Video job ${id} complete: ${transcodes.length} transcodes, ${posters.length} posters`)
  } catch (err) {
    logger.error(`Video job ${id} failed: ${err}`)
    throw err
  }
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

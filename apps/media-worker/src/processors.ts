import { Job } from "bullmq";
import { createLogger } from "./logger.js";
import { uploadFile, downloadFile } from "./storage.js";
import {
  processPhoto,
  ImageVariants,
  validateImageMagicBytes,
} from "./image-processor.js";
import {
  validateVideo,
  transcodeVideo,
  generatePosters,
  generateHoverPreview,
  generateLoop,
  VideoInfo,
} from "./video-processor.js";
import { mkdirSync, existsSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Re-export for tests
export { validateImageMagicBytes };

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

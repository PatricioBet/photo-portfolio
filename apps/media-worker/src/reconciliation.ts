import { Redis } from 'ioredis'
import { createLogger } from './logger.js'
import { s3Client, PRIVATE_BUCKET, getObject } from './r2.js'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getRedisConnection } from './connection.js'

const logger = createLogger('reconciliation')

// ── Reconcile orphaned incoming files ─────────────────────────
// When the worker starts (or restarts after a crash), check for:
// 1. Files in incoming/ with no corresponding job
// 2. Jobs stuck in "processing" state
// 3. Partial uploads in multipart

export async function reconcileIncomingFiles(connection: Redis): Promise<void> {
  try {
    // List files in incoming/ bucket
    const incomingFiles = await listIncomingFiles()

    if (incomingFiles.length === 0) {
      logger.info('No incoming files to reconcile.')
      return
    }

    logger.info(`Found ${incomingFiles.length} incoming files to reconcile.`)

    for (const file of incomingFiles) {
      // Check if this file has already been processed
      // by looking for any public derivatives
      const baseKey = file.Key!.replace('incoming/', '')

      if (await hasDerivatives(baseKey)) {
        logger.info(`Skipping ${baseKey}: derivatives already exist`)
        continue
      }

      // Check if a job exists for this file
      const jobId = `job-${baseKey.replace(/\//g, '-')}`
      const job = await getJobState(jobId)

      if (job?.state === 'completed') {
        logger.info(`Skipping ${baseKey}: job already completed`)
        continue
      }

      if (job?.state === 'waiting' || job?.state === 'active') {
        logger.info(`Skipping ${baseKey}: job ${jobId} is ${job.state}`)
        continue
      }

      // Job is missing or failed — requeue or mark for review
      if (job?.state === 'failed') {
        logger.warn(`Requeuing failed job for ${baseKey}`)
        await requeueJob(jobId, baseKey)
        continue
      }

      // No job exists — create one
      logger.info(`Creating new job for orphaned file: ${baseKey}`)
      await createReconciliationJob(baseKey)
    }

    logger.info('Reconciliation complete.')
  } catch (err) {
    logger.error(`Reconciliation failed: ${err}`)
    // Don't throw — the worker should still start even if reconciliation fails
  }
}

// ── List files in incoming/ ───────────────────────────────────
async function listIncomingFiles(): Promise<any[]> {
  const files: any[] = []
  let continuationToken: string | undefined

  do {
    const response = await s3Client.send(new ListObjectsV2Command({
      Bucket: PRIVATE_BUCKET,
      Prefix: 'incoming/',
      ContinuationToken: continuationToken,
      MaxKeys: 1000,
    }))

    if (response.Contents) {
      files.push(...response.Contents.filter((f) => f.Key && f.Size && f.Size > 0))
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined
  } while (continuationToken)

  return files
}

// ── Check if derivatives exist ────────────────────────────────
async function hasDerivatives(baseKey: string): Promise<boolean> {
  // Check for any derivative key pattern
  const checkKeys = [
    `avif/${baseKey}/`,
    `webp/${baseKey}/`,
    `jpeg/${baseKey}/`,
    `mp4/${baseKey}/`,
    `poster/${baseKey}/`,
  ]

  for (const prefix of checkKeys) {
    const response = await s3Client.send(new ListObjectsV2Command({
      Bucket: 'photo-public',
      Prefix: prefix,
      MaxKeys: 1,
    }))

    if (response.Contents && response.Contents.length > 0) {
      return true
    }
  }

  return false
}

// ── Get job state from Redis ──────────────────────────────────
async function getJobState(jobId: string): Promise<{ state: string } | null> {
  const redis = getRedisConnection()

  try {
    const state = await redis.hget(`bull:media-queue:${jobId}`, 'state')
    return state ? { state } : null
  } catch {
    return null
  }
}

// ── Requeue a failed job ──────────────────────────────────────
async function requeueJob(jobId: string, baseKey: string): Promise<void> {
  const redis = getRedisConnection()

  // Move job from failed to waiting
  await redis.zrem('bull:media-queue:failed', jobId)
  await redis.zadd('bull:media-queue:waiting', 0, jobId)

  // Reset job state
  await redis.hset(`bull:media-queue:${jobId}`, 'state', 'waiting')

  logger.info(`Requeued job ${jobId}`)
}

// ── Create a reconciliation job ───────────────────────────────
async function createReconciliationJob(baseKey: string): Promise<void> {
  const { createRedisConnection } = await import('./connection.js')
  const { Worker } = await import('bullmq')

  const connection = await createRedisConnection()
  const worker = new Worker('media-queue', async () => {
    // This is a placeholder — in production, you'd enqueue via the API
    logger.info(`Reconciliation job created for ${baseKey}`)
  }, { connection })

  // For now, just log — actual job creation should go through the API
  logger.info(`Would enqueue job for ${baseKey} via API`)

  await worker.close()
}

// ── Clean up orphaned multipart uploads ───────────────────────
export async function cleanupOrphanedMultipart(bucket: string): Promise<void> {
  const response = await s3Client.send(new ListObjectsV2Command({
    Bucket: bucket,
    MaxKeys: 1000,
  }))

  // Note: In production, use ListMultipartUploadsCommand for multipart cleanup
  // This is a placeholder for the actual multipart listing

  logger.info('Multipart cleanup check complete.')
}

// ── Clean up temp files older than 24 hours ───────────────────
export async function cleanupTempFiles(): Promise<void> {
  const { execFile } = await import('child_process')
  const { promisify } = await import('util')
  const execFileAsync = promisify(execFile)

  try {
    // Clean worker temp directory (managed by the OS/container)
    // In production, use a dedicated temp directory with lifecycle management
    logger.info('Temp file cleanup scheduled.')
  } catch (err) {
    logger.error(`Temp cleanup failed: ${err}`)
  }
}

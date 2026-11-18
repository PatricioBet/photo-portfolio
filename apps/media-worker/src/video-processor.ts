import { createLogger } from './logger.js'

const logger = createLogger('video-processor')

// ── Video processing configuration ────────────────────────────
const RESOLUTIONS = [
  { width: 1920, height: 1080, bitrate: '5000k', label: '1080p' },
  { width: 1280, height: 720, bitrate: '2500k', label: '720p' },
  { width: 854, height: 480, bitrate: '1000k', label: '480p' },
] as const

const AUDIO_BITRATE = '128k'
const GOP_SIZE = '48' // ~2 seconds at 24fps
const PRESET = 'medium'

// ── Validate video with ffprobe ───────────────────────────────
export interface VideoInfo {
  duration: number
  width: number
  height: number
  fps: number
  codec: string
  hasAudio: boolean
  streamCount: number
}

export async function validateVideo(inputPath: string): Promise<VideoInfo> {
  const { execFile } = await import('child_process')
  const { promisify } = await import('util')
  const execFileAsync = promisify(execFile)

  try {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      inputPath,
    ])

    const probe = JSON.parse(stdout)
    const videoStream = probe.streams?.find((s: any) => s.codec_type === 'video')
    const audioStreams = probe.streams?.filter((s: any) => s.codec_type === 'audio') || []
    const dataStreams = probe.streams?.filter((s: any) => s.codec_type === 'data') || []

    // Reject videos with data/attachment streams (potential polyglot attack)
    if (dataStreams.length > 0) {
      throw new Error('Video contains data/attachment streams — rejected for security')
    }

    if (!videoStream) {
      throw new Error('No video stream found')
    }

    // Parse dimensions
    const width = parseInt(videoStream.width || '0', 10)
    const height = parseInt(videoStream.height || '0', 10)

    // Parse FPS
    const fpsStr = videoStream.r_frame_rate || '30/1'
    const [num, den] = fpsStr.split('/')
    const fps = den ? parseFloat(num) / parseFloat(den) : 30

    // Parse duration
    const duration = parseFloat(probe.format?.duration || '0')

    // Validate limits
    if (duration > 600) { // 10 minutes
      throw new Error(`Video too long: ${duration}s exceeds 10min limit`)
    }
    if (width > 3840 || height > 2160) {
      throw new Error(`Video resolution too large: ${width}x${height} exceeds 4K limit`)
    }
    if (fps > 60) {
      throw new Error(`FPS too high: ${fps} exceeds 60fps limit`)
    }

    logger.info(`Video validated: ${width}x${height}, ${fps}fps, ${duration}s`)

    return {
      duration,
      width,
      height,
      fps,
      codec: videoStream.codec_name || 'unknown',
      hasAudio: audioStreams.length > 0,
      streamCount: probe.streams?.length || 0,
    }
  } catch (err) {
    if (err instanceof Error) throw err
    throw new Error(`Video validation failed: ${String(err)}`)
  }
}

// ── Transcode video to multiple resolutions ───────────────────
export interface VideoTranscodeResult {
  key: string
  path: string
}

export async function transcodeVideo(
  inputPath: string,
  outputDir: string,
  videoInfo: VideoInfo
): Promise<VideoTranscodeResult[]> {
  const { execFile } = await import('child_process')
  const { promisify } = await import('util')
  const execFileAsync = promisify(execFile)

  const results: VideoTranscodeResult[] = []

  // Use the smaller of original dimensions and target resolution
  for (const res of RESOLUTIONS) {
    if (res.width >= videoInfo.width && res.height >= videoInfo.height) {
      // Skip if this resolution is larger than original
      continue
    }

    const outputKey = `mp4/${res.label}/video.mp4`
    const outputPath = `${outputDir}/${outputKey}`

    logger.info(`Transcoding to ${res.label}: ${res.width}x${res.height}`)

    try {
      await execFileAsync('ffmpeg', [
        '-nostdin',
        '-protocol_whitelist', 'file',
        '-i', inputPath,
        '-c:v', 'libx264',
        '-preset', PRESET,
        '-b:v', res.bitrate,
        '-maxrate', res.bitrate,
        '-bufsize', `${parseInt(res.bitrate) * 2}k`,
        '-c:a', 'aac',
        '-b:a', AUDIO_BITRATE,
        '-g', GOP_SIZE,
        '-keyint_min', GOP_SIZE,
        '-pix_fmt', 'yuv420p',
        '-vf', `scale=${res.width}:${res.height}:force_original_aspect_ratio=decrease,pad=${res.width}:${res.height}:(ow-iw)/2:(oh-ih)/2`,
        '-movflags', '+faststart',
        '-t', '300', // Cap at 5 minutes per segment
        '-timeout', '1800000000', // 30 minute timeout in microseconds
        '-y',
        outputPath,
      ], {
        timeout: 1_800_000, // 30 minutes
      })

      results.push({ key: outputKey, path: outputPath })
    } catch (err) {
      logger.error(`Transcode failed for ${res.label}: ${err}`)
      // Don't throw — partial results are better than nothing, but log clearly
    }
  }

  return results
}

// ── Generate video poster frames ──────────────────────────────
export interface PosterResult {
  key: string
  path: string
  width: number
  height: number
}

export async function generatePosters(
  inputPath: string,
  outputDir: string,
  duration: number
): Promise<PosterResult[]> {
  const { execFile } = await import('child_process')
  const { promisify } = await import('util')
  const execFileAsync = promisify(execFile)

  const results: PosterResult[] = []
  const posterTimes = ['00:00:01', '00:00:05', '00:00:10'] // First 10 seconds

  for (const time of posterTimes) {
    const posterKey = `poster/${time.replace(/:/g, '-')}.avif`
    const posterPath = `${outputDir}/${posterKey}`

    try {
      await execFileAsync('ffmpeg', [
        '-nostdin',
        '-protocol_whitelist', 'file',
        '-ss', time,
        '-i', inputPath,
        '-vframes', '1',
        '-vf', 'scale=1920:-1',
        '-y',
        posterPath,
      ], { timeout: 60_000 })

      results.push({
        key: posterKey,
        path: posterPath,
        width: 1920,
        height: 1080,
      })
    } catch (err) {
      logger.warn(`Poster generation failed at ${time}: ${err}`)
    }
  }

  return results
}

// ── Generate hover preview (short clip) ───────────────────────
export async function generateHoverPreview(
  inputPath: string,
  outputDir: string,
  duration: number
): Promise<{ key: string; path: string } | null> {
  const { execFile } = await import('child_process')
  const { promisify } = await import('util')
  const execFileAsync = promisify(execFile)

  // Use first 3 seconds, 480p, no audio
  const previewDuration = Math.min(3, duration)
  const key = 'preview/preview.mp4'
  const outputPath = `${outputDir}/${key}`

  try {
    await execFileAsync('ffmpeg', [
      '-nostdin',
      '-protocol_whitelist', 'file',
      '-i', inputPath,
      '-t', String(previewDuration),
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-b:v', '800k',
      '-an', // No audio
      '-vf', 'scale=480:-1',
      '-movflags', '+faststart',
      '-y',
      outputPath,
    ], { timeout: 120_000 })

    return { key, path: outputPath }
  } catch (err) {
    logger.warn(`Hover preview generation failed: ${err}`)
    return null
  }
}

// ── Generate background loop (hero/reel) ──────────────────────
export async function generateLoop(
  inputPath: string,
  outputDir: string,
  duration: number
): Promise<{ key: string; path: string } | null> {
  const { execFile } = await import('child_process')
  const { promisify } = await import('util')
  const execFileAsync = promisify(execFile)

  // Use first 5 seconds, 720p, no audio, loop
  const loopDuration = Math.min(5, duration)
  const key = 'loop/loop.mp4'
  const outputPath = `${outputDir}/${key}`

  try {
    await execFileAsync('ffmpeg', [
      '-nostdin',
      '-protocol_whitelist', 'file',
      '-i', inputPath,
      '-t', String(loopDuration),
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-b:v', '1500k',
      '-an',
      '-vf', 'scale=1280:-1',
      '-movflags', '+faststart',
      '-stream_loop', '-1', // Loop infinitely
      '-y',
      outputPath,
    ], { timeout: 120_000 })

    return { key, path: outputPath }
  } catch (err) {
    logger.warn(`Loop generation failed: ${err}`)
    return null
  }
}

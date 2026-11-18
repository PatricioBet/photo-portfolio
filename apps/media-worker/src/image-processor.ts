import sharp from 'sharp'
import { createLogger } from './logger.js'
import { uploadVariants, uploadToPublic, UploadResult } from './r2-client.js'

const logger = createLogger('image-processor')

// ── Photo variants configuration ──────────────────────────────
const VARIANT_SIZES = [320, 640, 960, 1280, 1920, 2560] as const

const FORMAT_CONFIG = {
  avif: { quality: 55, effort: 9 },
  webp: { quality: 78 },
  jpeg: { quality: 80, progressive: true },
} as const

// Budget limits (KB) for AVIF
const AVIF_BUDGETS: Record<number, number> = {
  320: 40,
  640: 40,
  960: 80,
  1280: 180,
  1920: 350,
  2560: 600,
}

// ── Process a single photo ────────────────────────────────────
export interface ImageVariants {
  originals: Array<{ key: string; body: Buffer; contentType: string }>
  social: { key: string; body: Buffer; contentType: string }
  dominantColor: string
  thumbHash: string | null
}

export async function processPhoto(input: Buffer, originalKey: string): Promise<ImageVariants> {
  logger.info(`Processing photo: ${originalKey}`)

  // Read EXIF orientation and apply it, then strip EXIF
  let pipeline = sharp(input)

  // Auto-orient: apply EXIF rotation to pixels
  pipeline = pipeline.rotate()

  // Convert to sRGB color space
  pipeline = pipeline.ensureAlpha().normalize()

  // Get image metadata for dimensions
  const metadata = await pipeline.metadata()
  const width = metadata.width || 0
  const height = metadata.height || 0

  logger.info(`Original dimensions: ${width}x${height}`)

  // Enforce 200MP limit
  const totalPixels = width * height
  if (totalPixels > 200_000_000) {
    throw new Error(`Image too large: ${totalPixels} pixels exceeds 200MP limit`)
  }

  // Generate variants for each size
  const originals: Array<{ key: string; body: Buffer; contentType: string }> = []

  for (const size of VARIANT_SIZES) {
    if (size > width) continue // Don't upscale

    // AVIF with budget enforcement
    const avifBody = await generateAvif(pipeline.clone(), size, metadata)
    originals.push({
      key: `${originalKey}/avif/${size}w.avif`,
      body: avifBody,
      contentType: 'image/avif',
    })

    // WebP
    const webpBody = await pipeline.clone().resize(size, null, { withoutEnlargement: true }).webp(FORMAT_CONFIG.webp).toBuffer()
    originals.push({
      key: `${originalKey}/webp/${size}w.webp`,
      body: webpBody,
      contentType: 'image/webp',
    })

    // JPEG (up to 1920px)
    if (size <= 1920) {
      const jpegBody = await pipeline.clone().resize(size, null, { withoutEnlargement: true }).jpeg(FORMAT_CONFIG.jpeg).toBuffer()
      originals.push({
        key: `${originalKey}/jpeg/${size}w.jpg`,
        body: jpegBody,
        contentType: 'image/jpeg',
      })
    }
  }

  // Social image (1200x630, focal point crop)
  const socialBody = await pipeline.clone()
    .resize(1200, 630, {
      fit: 'cover',
      position: 'centre', // Can be overridden with focal point
    })
    .jpeg({ quality: 80 })
    .toBuffer()

  // Extract dominant color
  const { data, info } = await pipeline.clone()
    .resize(1, 1)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const dominantColor = info.channels === 3
    ? `#${data[0].toString(16).padStart(2, '0')}${data[1].toString(16).padStart(2, '0')}${data[2].toString(16).padStart(2, '0')}`
    : '#000000'

  // Extract EXIF data for DB (before stripping)
  const exifPipeline = sharp(input)
  const exifData = await exifPipeline.exif()

  logger.info(`Photo processed: ${originalKey}, variants: ${originals.length}`)

  return {
    originals,
    social: {
      key: `${originalKey}/social.jpg`,
      body: socialBody,
      contentType: 'image/jpeg',
    },
    dominantColor,
    thumbHash: null, // ThumbHash would require a separate library
  }
}

// ── Generate AVIF with budget enforcement ─────────────────────
async function generateAvif(
  pipeline: sharp.Sharp,
  size: number,
  originalMetadata: sharp.Metadata
): Promise<Buffer> {
  let quality = FORMAT_CONFIG.avif.quality
  const budget = AVIF_BUDGETS[size] || 40

  let body: Buffer
  let attempts = 0

  do {
    body = await pipeline.clone()
      .resize(size, null, { withoutEnlargement: true })
      .avif({ quality, effort: FORMAT_CONFIG.avif.effort })
      .toBuffer()

    attempts++
    quality--

    // If we exceed budget and quality is at minimum, accept it
    if (body.length > budget && quality <= 40) {
      logger.warn(`AVIF ${size}w exceeds budget (${body.length} > ${budget}KB) at min quality 40`)
      break
    }
  } while (body.length > budget && quality > 40 && attempts < 10)

  return body
}

// ── Generate social image with focal point ────────────────────
export async function generateSocialImage(
  input: Buffer,
  focalX: number = 0.5,
  focalY: number = 0.5
): Promise<Buffer> {
  const pipeline = sharp(input)

  // Calculate crop position based on focal point
  const metadata = await pipeline.metadata()
  const width = metadata.width || 1200
  const height = metadata.height || 630

  const cropX = Math.max(0, Math.min(width - 1200, focalX * width - 600))
  const cropY = Math.max(0, Math.min(height - 630, focalY * height - 315))

  return pipeline.clone()
    .extract({
      left: Math.round(cropX),
      top: Math.round(cropY),
      width: 1200,
      height: 630,
    })
    .jpeg({ quality: 80 })
    .toBuffer()
}

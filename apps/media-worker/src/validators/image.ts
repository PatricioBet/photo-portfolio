import sharp from "sharp";
import { logger } from "./logger";

export async function validateImage(buffer: Buffer): Promise<{
  valid: boolean;
  error?: string;
  format: string;
  width: number;
  height: number;
}> {
  try {
    // Check for polyglot attack: only allow one valid JPEG header
    const isJpeg =
      buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

    if (!isJpeg && buffer[0] !== 0x89) {
      return {
        valid: false,
        error: "Invalid image format",
        format: "unknown",
        width: 0,
        height: 0,
      };
    }

    const metadata = await sharp(buffer).metadata();

    // Check file size limit (20MB)
    if (buffer.length > 20 * 1024 * 1024) {
      return {
        valid: false,
        error: "Image too large (max 20MB)",
        format: metadata.format ?? "unknown",
        width: 0,
        height: 0,
      };
    }

    // Check dimensions
    if (
      !metadata.width ||
      !metadata.height ||
      metadata.width < 100 ||
      metadata.height < 100
    ) {
      return {
        valid: false,
        error: "Image dimensions too small",
        format: metadata.format ?? "unknown",
        width: 0,
        height: 0,
      };
    }

    return {
      valid: true,
      format: metadata.format ?? "unknown",
      width: metadata.width,
      height: metadata.height,
    };
  } catch (err) {
    logger.error({ err }, "Image validation failed");
    return {
      valid: false,
      error: "Image validation error",
      format: "unknown",
      width: 0,
      height: 0,
    };
  }
}

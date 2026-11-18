import ffprobe from "fluent-ffmpeg";
import { logger } from "./logger";

export function validateVideo(filePath: string): Promise<{
  valid: boolean;
  error?: string;
  duration: number;
  width: number;
  height: number;
  format: string;
}> {
  return new Promise((resolve) => {
    ffprobe(filePath, (err, metadata) => {
      if (err) {
        logger.error({ err }, "Video probe failed");
        resolve({
          valid: false,
          error: "Invalid video file",
          duration: 0,
          width: 0,
          height: 0,
          format: "unknown",
        });
        return;
      }

      const videoStream = metadata.streams?.find((s) => s.codec_type === "video");
      const audioStream = metadata.streams?.find((s) => s.codec_type === "audio");

      if (!videoStream) {
        resolve({
          valid: false,
          error: "No video stream found",
          duration: 0,
          width: 0,
          height: 0,
          format: "unknown",
        });
        return;
      }

      // Check file size limit (500MB)
      const fileSize = metadata.format?.size ?? 0;
      if (fileSize > 500 * 1024 * 1024) {
        resolve({
          valid: false,
          error: "Video too large (max 500MB)",
          duration: 0,
          width: 0,
          height: 0,
          format: metadata.format?.format_name ?? "unknown",
        });
        return;
      }

      resolve({
        valid: true,
        duration: Number(metadata.format?.duration ?? 0),
        width: videoStream.width ?? 0,
        height: videoStream.height ?? 0,
        format: metadata.format?.format_name ?? "unknown",
      });
    });
  });
}

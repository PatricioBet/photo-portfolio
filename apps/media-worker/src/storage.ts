import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'fs'
import { join } from 'path'

const STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || '/data/media'

// Ensure base directory exists
function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

export interface UploadResult {
  key: string
  size: number
  path: string
}

// ── Upload to local storage ───────────────────────────────────
export function uploadFile(key: string, data: Buffer | Uint8Array): UploadResult {
  ensureDir(STORAGE_PATH)

  const filePath = join(STORAGE_PATH, key)
  const dir = join(STORAGE_PATH, key.substring(0, key.lastIndexOf('/')))
  if (key.includes('/')) {
    ensureDir(dir)
  }

  writeFileSync(filePath, Buffer.from(data))

  return {
    key,
    size: data.length,
    path: filePath,
  }
}

// ── Download from local storage ───────────────────────────────
export function downloadFile(key: string): Buffer {
  const filePath = join(STORAGE_PATH, key)
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${key}`)
  }
  return readFileSync(filePath)
}

// ── Delete file ───────────────────────────────────────────────
export function deleteFile(key: string): void {
  const filePath = join(STORAGE_PATH, key)
  if (existsSync(filePath)) {
    rmSync(filePath, { force: true })
  }
}

// ── Check if file exists ──────────────────────────────────────
export function fileExists(key: string): boolean {
  const filePath = join(STORAGE_PATH, key)
  return existsSync(filePath)
}

// ── Get storage path ──────────────────────────────────────────
export function getStoragePath(): string {
  return STORAGE_PATH
}

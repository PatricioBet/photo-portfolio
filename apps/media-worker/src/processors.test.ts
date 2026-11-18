import { describe, it, expect } from 'vitest'
import { validateImageMagicBytes } from './processors.js'

describe('validateImageMagicBytes', () => {
  it('accepts JPEG magic bytes', () => {
    const jpeg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10])
    expect(() => validateImageMagicBytes(jpeg)).not.toThrow()
  })

  it('accepts PNG magic bytes', () => {
    const png = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A])
    expect(() => validateImageMagicBytes(png)).not.toThrow()
  })

  it('accepts WebP magic bytes', () => {
    const webp = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50])
    expect(() => validateImageMagicBytes(webp)).not.toThrow()
  })

  it('rejects invalid bytes', () => {
    const invalid = Buffer.from([0x00, 0x00, 0x00, 0x00])
    expect(() => validateImageMagicBytes(invalid)).toThrow('Invalid image file')
  })

  it('rejects too-short buffer', () => {
    const short = Buffer.from([0xFF, 0xD8])
    expect(() => validateImageMagicBytes(short)).toThrow('Invalid image file')
  })
})

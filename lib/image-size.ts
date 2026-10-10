import fs from 'fs';
import path from 'path';

export interface ImageInfo {
  width: number;
  height: number;
  type: 'image/jpeg' | 'image/png' | 'image/webp';
}

/**
 * Reads the pixel size of a JPEG, PNG, or WebP under public/ at build time, so the
 * og:image width and height we declare always match the real file. Returns null for
 * anything it cannot read (remote URLs, unknown formats).
 */
export function publicImageInfo(publicPath: string): ImageInfo | null {
  if (!publicPath.startsWith('/')) return null;
  const file = path.join(process.cwd(), 'public', publicPath);
  let buf: Buffer;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return null;
  }
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), type: 'image/png' };
  }
  if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3), type: 'image/webp' };
    if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff, type: 'image/webp' };
    if (chunk === 'VP8L') {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1, type: 'image/webp' };
    }
    return null;
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      // SOF0..SOF15, excluding DHT (C4), JPG (C8), and DAC (CC)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7), type: 'image/jpeg' };
      }
      i += 2 + len;
    }
  }
  return null;
}

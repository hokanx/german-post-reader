/**
 * Verifies a file's actual bytes match its declared MIME type, instead of
 * trusting the browser-supplied Content-Type on the multipart upload (which
 * an attacker can set to anything regardless of the file's real content).
 * Only checked against the three types this app ever accepts.
 */
export function matchesDeclaredType(bytes: Buffer, mimeType: string): boolean {
  switch (mimeType) {
    case "image/jpeg":
      return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "image/png":
      return (
        bytes.length >= 8 &&
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
      );
    case "application/pdf":
      return bytes.length >= 5 && bytes.subarray(0, 5).toString("latin1") === "%PDF-";
    default:
      return false;
  }
}

"use client";

const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.85;

/**
 * Downscales and re-encodes an image client-side before upload. A letter
 * photo doesn't need full camera resolution for Gemini to read the text —
 * this exists because Vercel's serverless functions have a hard 4.5MB
 * request body ceiling that no server config can raise, and real phone
 * photos routinely run 3-15MB. Non-image files (PDFs) pass through
 * untouched; the caller is responsible for size-checking those separately.
 */
export async function compressImageIfNeeded(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Best-effort: some real phone photos (odd EXIF, unusual JPEG variants)
  // fail to decode via createImageBitmap in some browsers. That must never
  // strand the upload flow — fall back to the original file, which the
  // caller still size-checks against MAX_UPLOAD_BYTES with a proper error.
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch (error) {
    console.warn("Image compression skipped — using original file", error);
    return file;
  }
}

import type { PixelCrop } from "react-image-crop";

/**
 * Loads a fresh full-resolution copy of the image and crops it to the given
 * pixel crop, returning the result as a WebP Blob.
 */
export async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
): Promise<Blob> {
  // Load a fresh full-resolution copy to avoid display-size constraints
  const fullImage = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = image.src;
  });

  const scaleX = fullImage.naturalWidth / image.width;
  const scaleY = fullImage.naturalHeight / image.height;

  const canvasWidth = Math.round(crop.width * scaleX);
  const canvasHeight = Math.round(crop.height * scaleY);

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    fullImage,
    Math.round(crop.x * scaleX),
    Math.round(crop.y * scaleY),
    canvasWidth,
    canvasHeight,
    0,
    0,
    canvasWidth,
    canvasHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      0.92,
    );
  });
}

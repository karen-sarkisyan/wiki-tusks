/**
 * Convert a File object to a base64 data URL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function processImagesForSave(markdown: string): Promise<string> {
  return markdown;
}

export async function processImagesForDisplay(
  markdown: string
): Promise<string> {
  // Images are already embedded as base64 data URLs, no processing needed
  return markdown;
}

/**
 * No cleanup needed since we don't store temporary images anymore
 */
export function cleanupTempImages(): void {
  // No temporary storage to clean up
}

/**
 * Image upload handler for MDXEditor - converts image to base64 data URL
 */
export async function imageUploadHandler(image: File): Promise<string> {
  // Validate file type
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];
  if (!allowedTypes.includes(image.type)) {
    throw new Error('Only JPEG, PNG, GIF, WebP, and SVG images are supported');
  }

  // Validate file size (5MB limit for base64 encoding)
  const maxSize = 5 * 1024 * 1024; // 5MB (smaller limit since base64 increases size by ~33%)
  if (image.size > maxSize) {
    throw new Error('Image size must be less than 5MB');
  }

  // Convert image to base64 data URL immediately
  try {
    const dataUrl = await fileToDataUrl(image);
    return dataUrl;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image');
  }
}

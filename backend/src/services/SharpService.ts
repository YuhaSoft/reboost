import sharp from 'sharp';
import fs from 'fs';

// Function to get dimensions of an image

export class SharpService {

public static async getImageDimensions(imagePath: string): Promise<{ width: number, height: number }> {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    return { width: metadata.width || 0, height: metadata.height || 0 };
  } catch (error) {
    console.error("Error reading image dimensions:", error);
    throw error;
  }
}

}

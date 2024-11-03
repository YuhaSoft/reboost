import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import ResponseTemplate from '../global/response';

export class ImageController {
  public async downloadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filePath = req.params.path;
      const fullPath = path.join(__dirname, process.env.IMAGESPATH+"", filePath); // Adjust the path to your uploads directory

      if (fs.existsSync(fullPath)) {
        res.sendFile(fullPath);
      } else {
        res.json(ResponseTemplate.error("Image Not Found ",null,404));
      }
    } catch (error) {
      next(error);
    }
  }
}
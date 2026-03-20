import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Request } from 'express';
import { UploadsService } from './uploads.service';

type UploadBody = {
  category?: string;
  entityCode?: string;
  preserveName?: string | boolean;
};

@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname) {
          return cb(new BadRequestException('Archivo invalido'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 25 * 1024 * 1024,
      },
    }),
  )
  uploadFile(@Req() req: Request, @Body() body: UploadBody, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha subido ningún archivo');
    }

    const preserveName = body.preserveName === true || body.preserveName === 'true';
    const stored = this.uploadsService.storeFile(file, {
      category: body.category,
      entityCode: body.entityCode,
      preserveName,
    });

    return {
      url: `${req.protocol}://${req.get('host')}/uploads/${stored.category}/${stored.storedName}`,
      name: file.originalname,
      storedName: stored.storedName,
      size: file.size,
      mimeType: file.mimetype,
      category: stored.category,
    };
  }
}

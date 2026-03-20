import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join, resolve } from 'path';

@Injectable()
export class UploadsService {
  readonly rootDir = resolve(__dirname, '../../../uploads');

  ensureUploadDir(category?: string): string {
    const safeCategory = this.normalizeSegment(category || 'general');
    const target = join(this.rootDir, safeCategory);

    if (!existsSync(target)) {
      mkdirSync(target, { recursive: true });
    }

    return target;
  }

  buildFilename(originalName: string, opts?: { entityCode?: string; preserveName?: boolean }): string {
    const extension = extname(originalName || '');
    const entityCode = this.normalizeSegment(opts?.entityCode || '');

    if (entityCode) {
      return `${entityCode}${extension}`;
    }

    if (opts?.preserveName) {
      const rawName = (originalName || 'archivo').replace(extension, '');
      const normalized = this.normalizeSegment(rawName);
      return `${normalized || 'archivo'}${extension}`;
    }

    const base = (originalName || 'archivo').replace(extension, '');
    const normalized = this.normalizeSegment(base).slice(0, 60);
    return `${Date.now()}-${normalized || 'archivo'}${extension}`;
  }

  storeFile(
    file: Express.Multer.File,
    opts?: { category?: string; entityCode?: string; preserveName?: boolean },
  ): { category: string; storedName: string; absolutePath: string } {
    const category = this.normalizeSegment(opts?.category || 'general') || 'general';
    const directory = this.ensureUploadDir(category);
    const storedName = this.buildFilename(file.originalname, {
      entityCode: opts?.entityCode,
      preserveName: opts?.preserveName,
    });
    const absolutePath = join(directory, storedName);
    writeFileSync(absolutePath, file.buffer);
    return { category, storedName, absolutePath };
  }

  private normalizeSegment(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }
}

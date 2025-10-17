import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionEntity } from './entities/section.entity';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService],
  imports: [TypeOrmModule.forFeature([SectionEntity])],
})
export class SectionsModule {}

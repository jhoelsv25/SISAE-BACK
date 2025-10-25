import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeLevelEntity } from './entities/grade_leevel.entity';
import { GradeLevelController } from './grade_level.controller';
import { GradeLevelService } from './grade_level.service';

@Module({
  controllers: [GradeLevelController],
  providers: [GradeLevelService],
  imports: [TypeOrmModule.forFeature([GradeLevelEntity])],
})
export class GradeLevelModule {}

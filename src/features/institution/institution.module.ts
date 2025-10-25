import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutionEntity } from './entities/institution.entity';
import { InstitutionController } from './institution.controller';
import { InstitutionService } from './institution.service';

@Module({
  controllers: [InstitutionController],
  providers: [InstitutionService],
  imports: [TypeOrmModule.forFeature([InstitutionEntity])],
})
export class InstitutionModule {}

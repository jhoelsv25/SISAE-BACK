import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentGuardianEntity } from './entities/student_guardian.entity';
import { StudentGuardiansController } from './student_guardians.controller';
import { StudentGuardiansService } from './student_guardians.service';

@Module({
  controllers: [StudentGuardiansController],
  providers: [StudentGuardiansService],
  imports: [TypeOrmModule.forFeature([StudentGuardianEntity])],
})
export class StudentGuardiansModule {}

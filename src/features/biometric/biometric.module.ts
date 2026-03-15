import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiometricEntity } from './entities/biometric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BiometricEntity])],
  exports: [TypeOrmModule],
})
export class BiometricModule {}

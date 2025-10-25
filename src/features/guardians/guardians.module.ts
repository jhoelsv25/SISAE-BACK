import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardianEntity } from './entities/guardian.entity';
import { GuardiansController } from './guardians.controller';
import { GuardiansService } from './guardians.service';

@Module({
  controllers: [GuardiansController],
  providers: [GuardiansService],
  imports: [TypeOrmModule.forFeature([GuardianEntity])],
})
export class GuardiansModule {}

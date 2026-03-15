import { Body, Controller, Get, Put } from '@nestjs/common';
import { BiometricConfigRepository } from '../infrastructure/persistence/repositories/biometric-config.repository';

@Controller('administration/biometric-config')
export class BiometricConfigController {
  constructor(private readonly repo: BiometricConfigRepository) {}

  @Get()
  getConfig() {
    return this.repo.getActive();
  }

  @Put()
  updateConfig(
    @Body()
    dto: {
      ip: string;
      port?: number;
      timeout?: number;
      inport?: number;
      isActive?: boolean;
    },
  ) {
    return this.repo.upsert({
      ip: dto.ip,
      port: dto.port ?? 4370,
      timeout: dto.timeout ?? 5000,
      inport: dto.inport ?? 5200,
      isActive: dto.isActive ?? true,
    });
  }
}

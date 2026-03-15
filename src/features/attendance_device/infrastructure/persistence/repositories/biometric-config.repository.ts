import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BiometricConfigRepoPort,
  BiometricDeviceConfig,
} from '../../../application/ports/biometric-config-repo.port';
import { BiometricEntity } from '../../../../biometric/entities/biometric.entity';

@Injectable()
export class BiometricConfigRepository implements BiometricConfigRepoPort {
  constructor(
    @InjectRepository(BiometricEntity)
    private readonly repo: Repository<BiometricEntity>,
  ) {}

  async getActive(): Promise<BiometricDeviceConfig | null> {
    return this.repo.findOne({ where: { isActive: true } });
  }

  async upsert(config: Omit<BiometricDeviceConfig, 'id'>): Promise<BiometricDeviceConfig> {
    const existing = await this.repo.findOne({ where: { isActive: true } });
    if (existing) {
      this.repo.merge(existing, config);
      return this.repo.save(existing);
    }

    const created = this.repo.create(config);
    return this.repo.save(created);
  }
}

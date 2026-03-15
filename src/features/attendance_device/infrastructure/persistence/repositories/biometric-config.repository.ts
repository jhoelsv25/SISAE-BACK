import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BiometricConfigRepoPort,
  BiometricDeviceConfig,
} from '../../../application/ports/biometric-config-repo.port';
import { BiometricDeviceConfigEntity } from '../entities/biometric-config.entity';

@Injectable()
export class BiometricConfigRepository implements BiometricConfigRepoPort {
  constructor(
    @InjectRepository(BiometricDeviceConfigEntity)
    private readonly repo: Repository<BiometricDeviceConfigEntity>,
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

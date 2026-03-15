import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceUserRepoPort } from '../../../application/ports/device-user-repo.port';
import { DeviceUser } from '../../../domain/entities/device-user.entity';
import { DeviceUserEntity } from '../entities/device-user.entity';

@Injectable()
export class DeviceUserRepository implements DeviceUserRepoPort {
  constructor(
    @InjectRepository(DeviceUserEntity)
    private readonly repo: Repository<DeviceUserEntity>,
  ) {}

  async saveMany(users: DeviceUser[]): Promise<void> {
    if (!users.length) return;
    await this.repo.save(
      users.map((user) => ({
        id: user.id,
        deviceUserId: user.deviceUserId,
        name: user.name,
        role: user.role,
        cardNo: user.cardNo,
      })),
    );
  }

  async findAll(): Promise<DeviceUser[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }
}

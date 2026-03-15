import { DeviceUser } from '../../domain/entities/device-user.entity';

export interface DeviceUserRepoPort {
  saveMany(users: DeviceUser[]): Promise<void>;
  findAll(): Promise<DeviceUser[]>;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceLogRepoPort } from '../../../application/ports/attendance-log-repo.port';
import { AttendanceLog } from '../../../domain/entities/attendance-log.entity';
import { DeviceAttendanceLogEntity } from '../entities/attendance-log.entity';

@Injectable()
export class AttendanceLogRepository implements AttendanceLogRepoPort {
  constructor(
    @InjectRepository(DeviceAttendanceLogEntity)
    private readonly repo: Repository<DeviceAttendanceLogEntity>,
  ) {}

  async saveMany(logs: AttendanceLog[]): Promise<void> {
    if (!logs.length) return;
    await this.repo.save(
      logs.map((log) => ({
        id: log.id,
        deviceUserId: log.deviceUserId,
        timestamp: log.timestamp,
        status: log.status,
        punch: log.punch,
        deviceIp: log.deviceIp,
      })),
    );
  }

  async findAll(): Promise<AttendanceLog[]> {
    return this.repo.find({ order: { timestamp: 'DESC' } });
  }
}

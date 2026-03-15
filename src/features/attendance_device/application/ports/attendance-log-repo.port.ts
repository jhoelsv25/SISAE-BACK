import { AttendanceLog } from '../../domain/entities/attendance-log.entity';

export interface AttendanceLogRepoPort {
  saveMany(logs: AttendanceLog[]): Promise<void>;
  findAll(): Promise<AttendanceLog[]>;
}

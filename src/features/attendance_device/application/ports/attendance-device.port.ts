import { AttendanceLog } from '../../domain/entities/attendance-log.entity';
import { DeviceUser } from '../../domain/entities/device-user.entity';

export interface AttendanceDevicePort {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getUsers(): Promise<DeviceUser[]>;
  getAttendanceLogs(): Promise<AttendanceLog[]>;
}

import { AttendanceDevicePort } from '../ports/attendance-device.port';
import { AttendanceLogRepoPort } from '../ports/attendance-log-repo.port';

export class GetAttendanceLogsUseCase {
  constructor(
    private readonly device: AttendanceDevicePort,
    private readonly repo: AttendanceLogRepoPort,
  ) {}

  async execute() {
    await this.device.connect();
    const logs = await this.device.getAttendanceLogs();
    await this.repo.saveMany(logs);
    await this.device.disconnect();
    return this.repo.findAll();
  }
}

import { AttendanceDevicePort } from '../ports/attendance-device.port';
import { DeviceUserRepoPort } from '../ports/device-user-repo.port';

export class GetAttendanceUsersUseCase {
  constructor(
    private readonly device: AttendanceDevicePort,
    private readonly repo: DeviceUserRepoPort,
  ) {}

  async execute() {
    await this.device.connect();
    const users = await this.device.getUsers();
    await this.repo.saveMany(users);
    await this.device.disconnect();
    return this.repo.findAll();
  }
}

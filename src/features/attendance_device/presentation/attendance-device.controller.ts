import { Controller, Get } from '@nestjs/common';
import { GetAttendanceLogsUseCase } from '../application/use-cases/get-attendance-logs.usecase';
import { GetAttendanceUsersUseCase } from '../application/use-cases/get-attendance-users.usecase';

@Controller('attendance')
export class AttendanceDeviceController {
  constructor(
    private readonly getLogs: GetAttendanceLogsUseCase,
    private readonly getUsers: GetAttendanceUsersUseCase,
  ) {}

  @Get('logs')
  getAttendanceLogs() {
    return this.getLogs.execute();
  }

  @Get('users')
  getAttendanceUsers() {
    return this.getUsers.execute();
  }
}

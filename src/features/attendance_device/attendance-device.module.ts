import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceDeviceController } from './presentation/attendance-device.controller';
import { BiometricConfigController } from './presentation/biometric-config.controller';
import { GetAttendanceLogsUseCase } from './application/use-cases/get-attendance-logs.usecase';
import { GetAttendanceUsersUseCase } from './application/use-cases/get-attendance-users.usecase';
import { ZkAttendanceClient } from './infrastructure/device/zk-attendance.client';
import { AttendanceLogRepository } from './infrastructure/persistence/repositories/attendance-log.repository';
import { DeviceUserRepository } from './infrastructure/persistence/repositories/device-user.repository';
import { DeviceAttendanceLogEntity } from './infrastructure/persistence/entities/attendance-log.entity';
import { DeviceUserEntity } from './infrastructure/persistence/entities/device-user.entity';
import { BiometricEntity } from '../biometric/entities/biometric.entity';
import { BiometricConfigRepository } from './infrastructure/persistence/repositories/biometric-config.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceAttendanceLogEntity, DeviceUserEntity, BiometricEntity])],
  controllers: [AttendanceDeviceController, BiometricConfigController],
  providers: [
    ZkAttendanceClient,
    AttendanceLogRepository,
    DeviceUserRepository,
    BiometricConfigRepository,
    {
      provide: GetAttendanceLogsUseCase,
      useFactory: (device: ZkAttendanceClient, repo: AttendanceLogRepository) =>
        new GetAttendanceLogsUseCase(device, repo),
      inject: [ZkAttendanceClient, AttendanceLogRepository],
    },
    {
      provide: GetAttendanceUsersUseCase,
      useFactory: (device: ZkAttendanceClient, repo: DeviceUserRepository) =>
        new GetAttendanceUsersUseCase(device, repo),
      inject: [ZkAttendanceClient, DeviceUserRepository],
    },
  ],
  exports: [ZkAttendanceClient],
})
export class AttendanceDeviceModule {}

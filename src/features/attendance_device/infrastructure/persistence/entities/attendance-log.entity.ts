import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('device_attendance_logs')
export class DeviceAttendanceLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  deviceUserId!: string;

  @Column({ type: 'timestamptz' })
  timestamp!: Date;

  @Column({ type: 'int', nullable: true })
  status!: number | null;

  @Column({ type: 'int', nullable: true })
  punch!: number | null;

  @Column()
  deviceIp!: string;
}

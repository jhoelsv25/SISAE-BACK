export class AttendanceLogDto {
  id!: string;
  deviceUserId!: string;
  timestamp!: Date;
  status!: number | null;
  punch!: number | null;
  deviceIp!: string;
}

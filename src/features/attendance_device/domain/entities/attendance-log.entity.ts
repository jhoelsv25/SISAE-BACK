export class AttendanceLog {
  constructor(
    public readonly id: string,
    public readonly deviceUserId: string,
    public readonly timestamp: Date,
    public readonly status: number | null,
    public readonly punch: number | null,
    public readonly deviceIp: string,
  ) {}
}

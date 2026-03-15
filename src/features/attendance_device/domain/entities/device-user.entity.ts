export class DeviceUser {
  constructor(
    public readonly id: string,
    public readonly deviceUserId: string,
    public readonly name: string,
    public readonly role: number | null,
    public readonly cardNo: string | null,
  ) {}
}

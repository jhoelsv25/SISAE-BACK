import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('device_users')
export class DeviceUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  deviceUserId!: string;

  @Column()
  name!: string;

  @Column({ type: 'int', nullable: true })
  role!: number | null;

  @Column({ nullable: true })
  cardNo!: string | null;
}

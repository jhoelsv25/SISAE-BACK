import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { PersonEntity } from '../../persons/entities/person.entity';
import { RoleEntity } from '../../roles/entities/role.entity';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

@Index('idx_user_username', ['username'])
@Index('idx_user_email', ['email'])
@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
  })
  email?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    select: false, // No incluir en consultas por defecto
  })
  password: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastLogin?: Date;

  @Column({
    type: 'int',
    default: 0,
  })
  failedLoginAttempts: number;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @OneToOne(() => PersonEntity, person => person.user, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  person?: PersonEntity;

  @ManyToOne(() => RoleEntity, role => role.users, {
    eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
  })
  role?: RoleEntity;
}

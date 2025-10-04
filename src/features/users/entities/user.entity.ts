import { Column, Entity, Index, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ProfileEntity } from '../../profile/entities/profile.entity';
import { RoleEntity } from '../../roles/entities/role.entity';

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
    nullable: true,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  lastName: string;

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
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  profilePicture?: string;

  @OneToOne(() => ProfileEntity, profile => profile.user, {
    nullable: true,
    cascade: true,
  })
  profile?: ProfileEntity;

  @ManyToOne(() => RoleEntity, role => role.users, {
    eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
  })
  role?: RoleEntity;
}

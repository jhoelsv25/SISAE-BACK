import { BaseEntity } from 'common/entities/base.entity';
import { Profile } from 'features/profile/entities/profile.entity';
import { Role } from 'features/roles/entities/role.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
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
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  profilePicture?: string;

  @OneToOne(() => Profile, profile => profile.user, {
    nullable: true,
    cascade: true,
  })
  profile?: Profile;

  @ManyToOne(() => Role, role => role.users, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  role: Role;
}

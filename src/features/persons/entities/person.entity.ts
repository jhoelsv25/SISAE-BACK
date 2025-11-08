import { BaseEntity } from '@common/entities/base.entity';
import { DocumentType, Gender, MaterialStatus } from '@features/persons/enums/person.enum';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'persons' })
export class PersonEntity extends BaseEntity {
  @Column({ type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'varchar', length: 50, unique: true })
  birthPlace: string;

  @Column({ type: 'varchar', length: 100 })
  nationality: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  address: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  district: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  province: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  department: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  mobile: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  photoUrl: string;

  @Column({ type: 'enum', enum: MaterialStatus })
  materialStatus: MaterialStatus;

  @OneToOne(() => UserEntity, user => user.person)
  user: UserEntity;
}

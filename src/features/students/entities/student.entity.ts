import { BaseEntity } from '@common/entities/base.entity';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { StudentStatus, StudentType } from '@features/students/enums/student.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'students' })
export class StudentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  studentCode: string;

  @Column({ type: 'enum', enum: StudentType })
  studentType: StudentType;

  @Column({ type: 'varchar', length: 100 })
  religion: string;

  @Column({ type: 'varchar', length: 100 })
  nativeLanguage: string;

  @Column({ type: 'boolean', default: false })
  hasDisability: boolean;

  @Column({ type: 'varchar', length: 100, array: true })
  healthIssues: string[];

  @Column({ type: 'varchar', length: 100 })
  insunranceNumber: string;

  @Column({ type: 'varchar', length: 10 })
  bloodType: string;

  @Column({ type: 'varchar', length: 255 })
  allergies: string;

  @Column({ type: 'text' })
  medicalConditions: string;

  @Column({ type: 'date' })
  admisionDate: Date;

  @Column({ type: 'date', nullable: true })
  withdrawalDate: Date;

  @Column({ type: 'text' })
  withdrawalReason: string;

  @Column({ type: 'enum', enum: StudentStatus })
  status: StudentStatus;

  @ManyToOne(() => InstitutionEntity)
  institution: InstitutionEntity;

  @ManyToOne(() => PersonEntity)
  person: PersonEntity;
}

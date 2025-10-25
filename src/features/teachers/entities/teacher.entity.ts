import { BaseEntity } from '@common/entities/base.entity';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { PersonEntity } from '@features/persons/entities/person.entity';
import {
  ContractType,
  EmployementStatus,
  LaborRegime,
  WorkloadType,
} from '@features/teachers/enums/teacher.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'teachers' })
export class TeacherEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  teacherCode: string;

  @Column({ type: 'varchar', length: 100 })
  specialization: string;

  @Column({ type: 'varchar', length: 100 })
  professionalTitle: string;

  @Column({ type: 'varchar', length: 100 })
  university: string;

  @Column({ type: 'int' })
  graduationYear: number;

  @Column({ type: 'varchar', length: 100 })
  professionalLicense: string;

  @Column({ type: 'enum', enum: ContractType })
  contractType: ContractType;

  @Column({ type: 'enum', enum: LaborRegime })
  laborRegime: LaborRegime;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ type: 'date', nullable: true })
  terminationDate: Date;

  @Column({ type: 'enum', enum: WorkloadType })
  workloadType: WorkloadType;

  @Column({ type: 'int' })
  weeklyHours: number;

  @Column({ type: 'varchar', length: 100 })
  teachingLevel: string;

  @Column({ type: 'enum', enum: EmployementStatus })
  employmentStatus: EmployementStatus;

  @ManyToOne(() => InstitutionEntity)
  institution: InstitutionEntity;

  @ManyToOne(() => PersonEntity)
  person: PersonEntity;
}

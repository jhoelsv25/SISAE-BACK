import { BaseEntity } from '@common/entities/base.entity';
import { StatusType } from '@common/enums/global.enum';
import { AcademicYearEntity } from '@features/academic_years/entities/academic_year.entity';
import { GradeEntity } from '@features/grades/entities/grade.entity';
import { SectionShift } from '@features/sections/enums/section.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('sections')
export class SectionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string; // A, B, C

  @Column({ type: 'int', nullable: true })
  capacity?: number; // Cantidad máxima de estudiantes

  @Column({ type: 'enum', enum: StatusType, default: StatusType.ACTIVE })
  status: StatusType;

  @Column({ type: 'enum', enum: SectionShift, default: SectionShift.MORNING })
  shift: SectionShift; //TODO: Relación con el turno (mañana, tarde, noche)
  @Column({ type: 'varchar', length: 100 })
  tutor: string; //TODO: Relación con el perfil del tutor

  @Column({ type: 'varchar', length: 100 })
  classroom: string;

  @Column({ type: 'int' })
  availableSlots: number; //TODO: Espacios disponibles en la sección

  @ManyToOne(() => GradeEntity, grade => grade.sections)
  @JoinColumn({ name: 'gradeId' })
  grade: GradeEntity;

  @ManyToOne(() => AcademicYearEntity)
  yearAcademic: AcademicYearEntity;
}

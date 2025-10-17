import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AcademicYearEntity } from '../../academic_years/entities/academic_year.entity';
import { SectionEntity } from '../../sections/entities/section.entity';

export enum Shift {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  NIGHT = 'night',
}

@Entity('grades')
export class GradeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string; // Ej: 1° Primaria

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  code?: string; // Código interno opcional

  @Column({ type: 'enum', enum: Shift, default: Shift.MORNING })
  shift: Shift; // Turno

  // Relación con Año Académico
  @ManyToOne(() => AcademicYearEntity)
  academicYear: AcademicYearEntity;

  // Relación con Secciones
  @OneToMany(() => SectionEntity, section => section.grade, { cascade: true })
  sections: SectionEntity[];
}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClassroomEntity } from '../../classrooms/entities/classroom.entity';
import { GradeEntity } from '../../grades/entities/grade.entity';

export enum SectionType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

@Entity('sections')
export class SectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string; // A, B, C

  @Column({ type: 'int', nullable: true })
  capacity?: number; // Cantidad máxima de estudiantes

  @ManyToOne(() => GradeEntity, grade => grade.sections)
  @JoinColumn({ name: 'gradeId' })
  grade: GradeEntity;

  @Column()
  gradeId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => ClassroomEntity, classroom => classroom.section, { cascade: true })
  classrooms: ClassroomEntity[];
}

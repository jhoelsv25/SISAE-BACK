import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SectionEntity } from '../../sections/entities/section.entity';

@Entity('classrooms')
@Index(['sectionId', 'name'], { unique: true }) // Evita duplicados de nombre por sección
export class ClassroomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string; // Ej: Aula 101, Sala de Música

  @Column({ type: 'int', nullable: true })
  capacity?: number; // Capacidad máxima de estudiantes

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Aula activa/inactiva

  // Relación con sección
  @ManyToOne(() => SectionEntity, section => section.classrooms)
  @JoinColumn({ name: 'sectionId' })
  section: SectionEntity;

  @Column()
  sectionId: string; // FK para consultas rápidas
}

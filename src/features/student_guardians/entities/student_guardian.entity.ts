import { BaseEntity } from '@common/entities/base.entity';
import { GuardianEntity } from '@features/guardians/entities/guardian.entity';
import { StudentEntity } from '@features/students/entities/student.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'student_guardians' })
export class StudentGuardianEntity extends BaseEntity {
  @Column({ type: 'boolean' })
  isPrimary: boolean;

  @Column({ type: 'boolean' })
  pickupAuthorization: boolean; // autorizacion para recoger al estudiante

  @Column({ type: 'text', nullable: true })
  receivesNotifications: string; // medios por los cuales recibe notificaciones (email, telefono, etc)

  @Column({ type: 'boolean' })
  emergencyContact: boolean; // contacto de emergencia

  @ManyToOne(() => StudentEntity)
  student: StudentEntity;

  @ManyToOne(() => GuardianEntity)
  guardian: GuardianEntity;
}

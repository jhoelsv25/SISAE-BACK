import { BaseEntity } from '@common/entities/base.entity';
import { PaymentStatus } from '@common/enums/global.enum';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { PaymentMethod } from '@features/payments/enums/payment.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'payments' })
export class PaymentEntity extends BaseEntity {
  @Column({ type: 'text' })
  concept: string; // concepto del pago

  @Column({ type: 'int' })
  installmentNumber: number; // numero de cuota

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // monto a pagar

  @Column({ type: 'date' })
  dueDate: Date; // fecha limite de pago

  @Column({ type: 'date' })
  paymentDate: Date; // fecha en que se realizo el pago

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountPaid: number; // monto pagado

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod; // metodo de pago

  @Column({ type: 'varchar', length: 50, unique: true })
  receiptNumber: string; // numero de recibo

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus; // estado del pago

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  lateFee: number; //mora

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'varchar', length: 100 })
  payerName: string; // Nombre de la persona que realiza el pago

  @ManyToOne(() => EnrollmentEntity)
  enrollmentId: EnrollmentEntity;
}

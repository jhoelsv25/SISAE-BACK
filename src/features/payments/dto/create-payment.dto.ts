import { PaymentStatus } from '@common/enums/global.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaymentMethod } from '../enums/payment.enum';

export class CreatePaymentDto {
  @ApiProperty({ example: 'Matrícula escolar', description: 'Concepto del pago' })
  @IsString({ message: 'El concepto debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El concepto es obligatorio.' })
  concept: string;

  @ApiProperty({ example: 1, description: 'Número de cuota' })
  @IsInt({ message: 'El número de cuota debe ser un número entero.' })
  installmentNumber: number;

  @ApiProperty({ example: 150.0, description: 'Monto a pagar' })
  @IsNumber({}, { message: 'El monto debe ser un número.' })
  amount: number;

  @ApiProperty({ example: '2025-10-30', description: 'Fecha límite de pago' })
  @IsDateString({}, { message: 'La fecha límite debe ser una fecha válida.' })
  dueDate: Date;

  @ApiProperty({ example: '2025-10-25', description: 'Fecha de pago' })
  @IsDateString({}, { message: 'La fecha de pago debe ser una fecha válida.' })
  paymentDate: Date;

  @ApiProperty({ example: 150.0, description: 'Monto pagado' })
  @IsNumber({}, { message: 'El monto pagado debe ser un número.' })
  amountPaid: number;

  @ApiProperty({ example: PaymentMethod.CASH, enum: PaymentMethod, description: 'Método de pago' })
  @IsEnum(PaymentMethod, {
    message:
      'El método de pago debe ser uno de: cash, credit_card, debit_card, bank_transfer, mobile_payment, yape, plin.',
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 'REC123456', description: 'Número de recibo' })
  @IsString({ message: 'El número de recibo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El número de recibo es obligatorio.' })
  receiptNumber: string;

  @ApiProperty({
    example: PaymentStatus.PENDING,
    enum: PaymentStatus,
    description: 'Estado del pago',
  })
  @IsEnum(PaymentStatus, {
    message: 'El estado debe ser uno de: pending, completed, failed, refunded.',
  })
  status: PaymentStatus;

  @ApiProperty({ example: 0, description: 'Mora', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'La mora debe ser un número.' })
  lateFee?: number;

  @ApiProperty({
    example: 'Pago realizado sin inconvenientes',
    description: 'Observaciones',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto.' })
  observations?: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del pagador' })
  @IsString({ message: 'El nombre del pagador debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del pagador es obligatorio.' })
  payerName: string;

  @ApiProperty({
    example: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'ID de la matrícula (UUID)',
  })
  @IsUUID('4', { message: 'La matrícula debe ser un UUID válido.' })
  enrollmentId: string;
}

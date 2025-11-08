import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly repo: Repository<PaymentEntity>,
  ) {}

  async create(dto: CreatePaymentDto) {
    try {
      const payment = this.repo.create({
        ...dto,
        enrollmentId: dto.enrollmentId ? { id: dto.enrollmentId } : undefined,
      });
      await this.repo.save(payment);
      return { message: 'Pago creado correctamente', data: payment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el pago', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const payments = await this.repo.find({ where: filter });
      return { message: 'Pagos encontrados correctamente', data: payments };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener los pagos', 500);
    }
  }

  async findOne(id: string) {
    try {
      const payment = await this.repo.findOne({ where: { id } });
      if (!payment) {
        throw new ErrorHandler('Pago no encontrado', 404);
      }
      return { message: 'Pago encontrado correctamente', data: payment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener el pago', 500);
    }
  }

  async update(id: string, dto: UpdatePaymentDto) {
    try {
      await this.repo.update(id, {
        ...dto,
        enrollmentId: dto.enrollmentId ? { id: dto.enrollmentId } : undefined,
      });
      const updatedPayment = await this.repo.findOne({ where: { id } });
      if (!updatedPayment) {
        throw new ErrorHandler('Pago no encontrado', 404);
      }
      return { message: 'Pago actualizado correctamente', data: updatedPayment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar el pago', 500);
    }
  }

  async remove(id: string) {
    try {
      const payment = await this.repo.findOne({ where: { id } });
      if (!payment) {
        throw new ErrorHandler('Pago no encontrado', 404);
      }
      await this.repo.remove(payment);
      return { message: 'Pago eliminado correctamente', data: payment };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar el pago', 500);
    }
  }
}

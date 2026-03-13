import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmailLogDto } from './dto/create-email_log.dto';
import { UpdateEmailLogDto } from './dto/update-email_log.dto';
import { EmailLogEntity } from './entities/email_log.entity';

@Injectable()
export class EmailLogsService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private readonly repository: Repository<EmailLogEntity>,
  ) {}

  async create(createEmailLogDto: CreateEmailLogDto) {
    const { user, ...rest } = createEmailLogDto;
    const log = this.repository.create({
      ...rest,
      user: { id: user } as any,
    });
    return await this.repository.save(log);
  }

  async findAll() {
    const [data, total] = await this.repository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async findByUser(userId: string, limit = 10) {
    const data = await this.repository.find({
      where: { user: { id: userId } as any },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return { data, total: data.length };
  }

  async findOne(id: string) {
    const log = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!log) throw new NotFoundException('Email log no encontrado');
    return log;
  }

  async update(id: string, updateEmailLogDto: UpdateEmailLogDto) {
    const log = await this.findOne(id);
    Object.assign(log, updateEmailLogDto);
    return await this.repository.save(log);
  }

  async remove(id: string) {
    const log = await this.findOne(id);
    return await this.repository.remove(log);
  }
}

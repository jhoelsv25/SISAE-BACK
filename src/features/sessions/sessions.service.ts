import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionEntity } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repository: Repository<SessionEntity>,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const { user, ...rest } = createSessionDto;
    const session = this.repository.create({
      ...rest,
      user: { id: user } as any,
    });
    return await this.repository.save(session);
  }

  async findAll() {
    const [data, total] = await this.repository.findAndCount({
      relations: ['user'],
      order: { lastActive: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string) {
    const session = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!session) throw new NotFoundException('Sesión no encontrada');
    return session;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    const session = await this.findOne(id);
    Object.assign(session, updateSessionDto);
    return await this.repository.save(session);
  }

  async remove(id: string) {
    const session = await this.findOne(id);
    return await this.repository.remove(session);
  }
}

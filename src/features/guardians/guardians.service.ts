import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { GuardianEntity } from './entities/guardian.entity';

@Injectable()
export class GuardiansService {
  constructor(
    @InjectRepository(GuardianEntity)
    private readonly repo: Repository<GuardianEntity>,
  ) {}

  async create(dto: CreateGuardianDto) {
    try {
      // Ensure 'person' is mapped to a DeepPartial<PersonEntity>
      const { person, ...rest } = dto;
      const guardian = this.repo.create({
        ...rest,
        person: { id: person }, // or map to the correct DeepPartial<PersonEntity> structure
      });
      await this.repo.save(guardian);
      return { message: 'Tutor creado correctamente', data: guardian };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear el tutor', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const guardians = await this.repo.find({ where: filter });
      return { message: 'Guardians retrieved successfully', data: guardians };
    } catch (error) {
      throw new ErrorHandler('Error retrieving guardians', 500);
    }
  }

  async findOne(id: string) {
    try {
      const guardian = await this.repo.findOne({ where: { id } });
      if (!guardian) throw new ErrorHandler('Guardian not found', 404);
      return { message: 'Guardian retrieved successfully', data: guardian };
    } catch (error) {
      throw new ErrorHandler('Error retrieving guardian', 500);
    }
  }

  async update(id: string, updateGuardianDto: UpdateGuardianDto) {
    try {
      const { person, ...rest } = updateGuardianDto;
      await this.repo.update(id, {
        ...rest,
        person: person ? { id: person } : undefined,
      });
      const updatedGuardian = await this.repo.findOne({ where: { id } });
      if (!updatedGuardian) throw new ErrorHandler('Guardian not found', 404);
      return { message: 'Guardian updated successfully', data: updatedGuardian };
    } catch (error) {
      throw new ErrorHandler('Error updating guardian', 500);
    }
  }

  async remove(id: string) {
    try {
      const guardian = await this.repo.findOne({ where: { id } });
      if (!guardian) throw new ErrorHandler('Guardian not found', 404);
      await this.repo.remove(guardian);
      return { message: 'Guardian removed successfully', data: guardian };
    } catch (error) {
      throw new ErrorHandler('Error removing guardian', 500);
    }
  }
}

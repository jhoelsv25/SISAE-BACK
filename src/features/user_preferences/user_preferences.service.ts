import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@features/users/entities/user.entity';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UserPreferenceEntity } from './entities/user_preference.entity';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreferenceEntity)
    private readonly repository: Repository<UserPreferenceEntity>,
  ) {}

  async getByUser(userId: string) {
    const preference = await this.repository.findOne({
      where: { user: { id: userId } as UserEntity },
    });

    if (preference) {
      return preference;
    }

    const created = this.repository.create({
      user: { id: userId } as UserEntity,
      preferences: {},
    });

    return await this.repository.save(created);
  }

  async updateByUser(userId: string, dto: UpdateUserPreferencesDto) {
    const preference = await this.repository.findOne({
      where: { user: { id: userId } as UserEntity },
    });

    if (!preference) {
      const created = this.repository.create({
        user: { id: userId } as UserEntity,
        preferences: dto.preferences || {},
      });
      return await this.repository.save(created);
    }

    preference.preferences = {
      ...(preference.preferences || {}),
      ...(dto.preferences || {}),
    };

    return await this.repository.save(preference);
  }

  async removeByUser(userId: string) {
    const preference = await this.repository.findOne({
      where: { user: { id: userId } as UserEntity },
    });

    if (!preference) {
      throw new NotFoundException('Preferencias no encontradas');
    }

    return await this.repository.remove(preference);
  }
}

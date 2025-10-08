import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserReadRepository } from '../repositories/user-read.repository';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly readRepo: UserReadRepository) {}

  async execute(id: string): Promise<UserEntity> {
    return await this.readRepo.findById(id);
  }
}

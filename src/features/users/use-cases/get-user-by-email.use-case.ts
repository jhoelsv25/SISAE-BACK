import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserReadRepository } from '../repositories/user-read.repository';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(private readonly readRepo: UserReadRepository) {}

  async execute(email: string): Promise<UserEntity | null> {
    return await this.readRepo.findByEmail(email);
  }
}

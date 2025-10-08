import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserReadRepository } from '../repositories/user-read.repository';

@Injectable()
export class GetUserByUsernameUseCase {
  constructor(private readonly readRepo: UserReadRepository) {}

  async execute(username: string): Promise<UserEntity | null> {
    return await this.readRepo.findByUsername(username);
  }
}

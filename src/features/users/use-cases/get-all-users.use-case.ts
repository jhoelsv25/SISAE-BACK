import { Injectable } from '@nestjs/common';
import { UserReadRepository } from '../repositories/user-read.repository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly readRepo: UserReadRepository) {}

  async execute(params: { page?: number; size?: number; search?: string; isActive?: boolean }) {
    return await this.readRepo.findAll(params);
  }
}

import { Injectable } from '@nestjs/common';
import { UserWriteRepository } from '../repositories/user-write.repository';

@Injectable()
export class UpdateLastLoginUseCase {
  constructor(private readonly writeRepo: UserWriteRepository) {}

  async execute(id: string): Promise<void> {
    await this.writeRepo.updateLastLogin(id);
  }
}

import { Injectable } from '@nestjs/common';
import { ErrorHandler } from '../../../common/exceptions';
import { UserEntity } from '../entities/user.entity';
import { UserReadRepository } from '../repositories/user-read.repository';
import { UserWriteRepository } from '../repositories/user-write.repository';

@Injectable()
export class ToggleUserStatusUseCase {
  constructor(
    private readonly readRepo: UserReadRepository,
    private readonly writeRepo: UserWriteRepository,
  ) {}

  async execute(id: string): Promise<{ message: string; data: Partial<UserEntity> }> {
    try {
      // Buscar el usuario
      const user = await this.readRepo.findById(id);

      // Cambiar el estado
      const updatedUser = await this.writeRepo.toggleActiveStatus(user);

      // Excluir password de la respuesta
      const { password, ...result } = updatedUser;

      return {
        message: 'Estado actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }
}

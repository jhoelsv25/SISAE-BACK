import { Injectable } from '@nestjs/common';
import { ErrorHandler } from '../../../common/exceptions';
import { UserEntity } from '../entities/user.entity';
import { UserReadRepository } from '../repositories/user-read.repository';
import { UserWriteRepository } from '../repositories/user-write.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly readRepo: UserReadRepository,
    private readonly writeRepo: UserWriteRepository,
  ) {}

  async execute(id: string): Promise<{ message: string; data: Partial<UserEntity> }> {
    try {
      // Buscar el usuario
      const user = await this.readRepo.findById(id);

      // Validar que no sea SuperAdmin
      if (user?.role?.name === 'SuperAdmin') {
        throw new ErrorHandler('No se puede eliminar el usuario SuperAdmin', 403);
      }

      // Eliminar el usuario
      await this.writeRepo.remove(user);

      return {
        message: 'El usuario ha sido eliminado exitosamente',
        data: { id },
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }
}

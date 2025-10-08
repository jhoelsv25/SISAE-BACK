import { Injectable } from '@nestjs/common';
import { ErrorHandler } from '../../../common/exceptions';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserReadRepository } from '../repositories/user-read.repository';
import { UserWriteRepository } from '../repositories/user-write.repository';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly readRepo: UserReadRepository,
    private readonly writeRepo: UserWriteRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateUserDto,
  ): Promise<{ message: string; data: Partial<UserEntity> }> {
    try {
      // Buscar el usuario actual
      const user = await this.readRepo.findById(id);

      // Validar username si viene y es diferente
      if (dto.username && dto.username !== user.username) {
        const existsByUsername = await this.readRepo.existsByUsername(dto.username);
        if (existsByUsername) {
          throw new ErrorHandler('Usuario con este nombre ya existe', 400);
        }
      }

      // Validar email si viene y es diferente
      if (dto.email && dto.email !== user.email) {
        const existsByEmail = await this.readRepo.existsByEmail(dto.email);
        if (existsByEmail) {
          throw new ErrorHandler('Usuario con este email ya existe', 400);
        }
      }

      // Actualizar el usuario
      const updatedUser = await this.writeRepo.update(id, dto, user);

      // Excluir password de la respuesta
      const { password, ...result } = updatedUser;

      return {
        message: 'El usuario ha sido actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }
}

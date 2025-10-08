import { Injectable } from '@nestjs/common';
import { ErrorHandler } from '../../../common/exceptions';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserReadRepository } from '../repositories/user-read.repository';
import { UserWriteRepository } from '../repositories/user-write.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly readRepo: UserReadRepository,
    private readonly writeRepo: UserWriteRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<{ message: string; data: Partial<UserEntity> }> {
    try {
      // Validar que el username no exista
      const existsByUsername = await this.readRepo.existsByUsername(dto.username);
      if (existsByUsername) {
        throw new ErrorHandler('Usuario ya existe', 400);
      }

      // Validar que el email no exista (si viene)
      if (dto.email) {
        const existsByEmail = await this.readRepo.existsByEmail(dto.email);
        if (existsByEmail) {
          throw new ErrorHandler('Usuario con este email ya existe', 400);
        }
      }

      // Crear el usuario
      const user = await this.writeRepo.create(dto);

      // Excluir password de la respuesta
      const { password, ...result } = user;

      return {
        message: 'El usuario ha sido creado exitosamente',
        data: result,
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }
}

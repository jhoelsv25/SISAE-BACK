import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../../common/exceptions';
import { comparePassword, hashPassword } from '../../../common/utils/password.util';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserPasswordService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new ErrorHandler('Usuario no encontrado', 404);
      const isMatch = await comparePassword(dto.currentPassword, user.password);
      if (!isMatch) throw new ErrorHandler('La contraseña actual es incorrecta', 400);
      user.password = await hashPassword(dto.newPassword);
      await this.userRepository.save(user);
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error inesperado, por favor intenta más tarde', 500);
    }
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return comparePassword(plain, hashed);
  }
}

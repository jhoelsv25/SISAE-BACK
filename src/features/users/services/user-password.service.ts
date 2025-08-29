import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../../common/exceptions';
import { comparePassword, hashPassword } from '../../../common/utils/password.util';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserPasswordService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return comparePassword(plain, hashed);
  }
}

import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PayloadAuth } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async validate(payload: PayloadAuth): Promise<PayloadAuth> {
    // Aquí puedes implementar la lógica de validación del payload
    // Por ejemplo, verificar si el usuario existe en la base de datos
    return payload; // Retorna el payload validado
  }
}

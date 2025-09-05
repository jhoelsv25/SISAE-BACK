import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../common/utils/password.util';
import { RoleService } from '../features/roles/services/role.service';
import { UsersService } from '../features/users/users.service';
import { LoginDto } from './dto/login.dto';
import { PayloadAuth } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}

  async getModulesByRole(roleId: string): Promise<any> {
    return this.roleService.getModulesAndPermissionsByRoleId(roleId);
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    // Buscar usuario por username
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    // Validar si el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Tu cuenta está inactiva. Por favor contacta al administrador para activarla.',
      );
    }
    // Validar contraseña
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Contraseña y/o usuario incorrecto');
    }
    // Generar tokens JWT incluyendo el rol
    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      message: 'Inicio de sesión exitoso, bienvenido ' + user.username,
      data: {
        user: {
          ...user,
          role: {
            id: user.role?.id || null,
            name: user.role?.name || null,
          },
        },
        accessToken,
        refreshToken,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      // Puedes agregar lógica para validar el refreshToken en base de datos si lo deseas
      const newAccessToken = this.jwtService.sign({
        sub: payload.sub,
        username: payload.username,
        email: payload.email,
        role: payload.role,
      });
      return {
        message: 'Token renovado',
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async logout() {
    // Aquí podrías invalidar el refreshToken en base de datos si lo manejas
    return { message: 'Logout exitoso' };
  }

  async validate(payload: PayloadAuth): Promise<any> {
    // Buscar el usuario por id y retornar con rol y permisos
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    // Mapear los permisos a formato 'modulo:accion' para el guard
    const permissions = (user.role?.permissions || []).map(
      (perm: any) => `${perm.module?.name}:${perm.action}`,
    );
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role?.name || null,
      permissions,
    };
  }

  private generateTokens(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role?.name || null,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
    return { accessToken, refreshToken };
  }
}

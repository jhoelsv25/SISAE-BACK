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
    // Obtener módulos y permisos del rol
    let modules = [];
    if (user.role?.id) {
      const roleData = await this.roleService.getModulesAndPermissionsByRoleId(user.role.id);
      modules = roleData.modules || [];
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
        modules,
      },
    };
  }
  async checkToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      let modules = [];
      if (user.role?.id) {
        const roleData = await this.roleService.getModulesAndPermissionsByRoleId(user.role.id);
        modules = roleData.modules || [];
      }
      return {
        message: 'Token válido',

        user: {
          ...user,
          role: {
            id: user.role?.id || null,
            name: user.role?.name || null,
          },
        },
        modules,
      };
    } catch (error) {
      throw new UnauthorizedException('Access token inválido o expirado');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const newAccessToken = this.jwtService.sign({
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role?.name || null,
      });

      return {
        message: 'Token renovado',
        data: {
          user: {
            ...user,
            role: {
              id: user.role?.id || null,
              name: user.role?.name || null,
            },
          },
          accessToken: newAccessToken,
        },
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
    // Buscar el usuario por id
    const user = await this.userService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    if (!user.role) {
      throw new UnauthorizedException('El usuario no tiene rol asignado');
    }
    // Obtener módulos y permisos del rol
    const roleData = await this.roleService.getModulesAndPermissionsByRoleId(user.role.id);

    // Función recursiva para extraer permisos
    function extractPermissions(modules: any[]): string[] {
      let perms: string[] = [];
      for (const mod of modules) {
        if (mod.permissions && mod.permissions.length) {
          perms.push(...mod.permissions);
        }
        if (mod.children && mod.children.length) {
          perms.push(...extractPermissions(mod.children));
        }
      }
      return perms;
    }

    const permissions = extractPermissions(roleData.modules || []);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      permissions,
      modules: roleData.modules || [],
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

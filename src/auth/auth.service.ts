import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorHandler } from '../common/exceptions';
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
    try {
      return this.roleService.getModulesAndPermissionsByRoleId(roleId);
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Error al obtener módulos del rol');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { username, password } = loginDto;
      // Buscar usuario por username
      const user = await this.userService.findByUsername(username);
      if (!user) {
        ErrorHandler.validation('Usuario no encontrado', 'Login');
      }
      // Validar si el usuario está activo
      if (!user.isActive) {
        ErrorHandler.forbidden(
          'Tu cuenta está inactiva. Por favor contacta al administrador para activarla.',
          'Login',
        );
      }
      // Validar contraseña
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        ErrorHandler.unauthorized('Contraseña y/o usuario incorrecto', 'Login');
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
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Error durante el inicio de sesión');
    }
  }
  async checkToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        ErrorHandler.unauthorized('Usuario no encontrado', 'CheckToken');
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
      ErrorHandler.handleUnknownError(error, 'Access token inválido o expirado');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        ErrorHandler.unauthorized('Usuario no encontrado', 'RefreshToken');
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
            id: user.id,
            username: user.username,
            email: user.email,
            isActive: user.isActive,
            role: {
              id: user.role?.id || null,
              name: user.role?.name || null,
            },
          },
          accessToken: newAccessToken,
        },
      };
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Refresh token inválido o expirado');
    }
  }

  async logout() {
    try {
      // Aquí podrías invalidar el refreshToken en base de datos si lo manejas
      return { message: 'Logout exitoso' };
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Error durante el logout');
    }
  }

  async validate(payload: PayloadAuth): Promise<any> {
    try {
      // Buscar el usuario por id
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        ErrorHandler.unauthorized('Usuario no encontrado', 'Validate');
      }
      if (!user.role) {
        ErrorHandler.unauthorized('El usuario no tiene rol asignado', 'Validate');
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
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Error al validar el usuario');
    }
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

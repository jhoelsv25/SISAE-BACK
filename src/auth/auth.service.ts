import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandler } from '../common/exceptions';
import { comparePassword } from '../common/utils/password.util';
import { GuardianEntity } from '../features/guardians/entities/guardian.entity';
import { RoleService } from '../features/roles/services/role.service';
import { StudentGuardianEntity } from '../features/student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '../features/students/entities/student.entity';
import { TeacherEntity } from '../features/teachers/entities/teacher.entity';
import { UsersService } from '../features/users/users.service';
import { SessionsService } from '../features/sessions/sessions.service';
import { LoginDto } from './dto/login.dto';
import { PayloadAuth } from './interfaces/payload.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly sessionsService: SessionsService,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(GuardianEntity)
    private readonly guardianRepository: Repository<GuardianEntity>,
    @InjectRepository(StudentGuardianEntity)
    private readonly studentGuardianRepository: Repository<StudentGuardianEntity>,
  ) {}

  async getModulesByRole(roleId: string): Promise<any> {
    try {
      return this.roleService.getModulesAndPermissionsByRoleId(roleId);
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Error al obtener módulos del rol');
    }
  }

  async login(loginDto: LoginDto, meta?: { ipAddress?: string; userAgent?: string }) {
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

      await this.registerSession({
        userId: user.id,
        sessionToken: refreshToken,
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      });

      return {
        message: 'Inicio de sesión exitoso, bienvenido ' + user.username,
        data: {
          user: await this.buildAuthUser(user),
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
        user: await this.buildAuthUser(user),
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

      await this.sessionsService.touchByToken(refreshToken);

      return {
        message: 'Token renovado',
        data: {
          user: await this.buildAuthUser(user),
          accessToken: newAccessToken,
        },
      };
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Refresh token inválido o expirado');
    }
  }

  async logout(refreshToken?: string) {
    try {
      if (refreshToken) {
        await this.sessionsService.removeByToken(refreshToken);
      }
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

  private async registerSession(params: {
    userId: string;
    sessionToken: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const { userId, sessionToken, ipAddress, userAgent } = params;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.getRefreshTokenTtlMs());

    await this.sessionsService.create({
      sessionToken,
      expiresAt: expiresAt.toISOString(),
      lastActive: now.toISOString(),
      userAgent: userAgent || 'unknown',
      ipAddress: ipAddress || 'unknown',
      user: userId,
    });
  }

  private getRefreshTokenTtlMs() {
    const raw = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const match = /^(\d+)([smhd])$/.exec(raw.trim());
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const value = Number(match[1]);
    const unit = match[2];
    const multiplier =
      unit === 's'
        ? 1000
        : unit === 'm'
          ? 60 * 1000
          : unit === 'h'
            ? 60 * 60 * 1000
            : 24 * 60 * 60 * 1000;
    return value * multiplier;
  }

  private async buildAuthUser(user: any) {
    const person = user?.person
      ? {
          id: user.person.id,
          firstName: user.person.firstName,
          lastName: user.person.lastName,
          documentType: user.person.documentType,
          birthDate: user.person.birthDate,
          gender: user.person.gender,
          birthPlace: user.person.birthPlace,
          nationality: user.person.nationality,
          address: user.person.address,
          district: user.person.district,
          province: user.person.province,
          department: user.person.department,
          phone: user.person.phone,
          mobile: user.person.mobile,
          email: user.person.email,
          photoUrl: user.person.photoUrl,
        }
      : undefined;

    const profile = await this.buildRoleProfile(user);

    return {
      id: user.id,
      username: user.username,
      firstName: person?.firstName ?? null,
      lastName: person?.lastName ?? null,
      email: user.email ?? person?.email ?? null,
      isActive: user.isActive,
      lastLogin: user.lastLogin ?? null,
      profilePicture: person?.photoUrl ?? null,
      role: {
        id: user.role?.id || null,
        name: user.role?.name || null,
      },
      code: profile.code ?? user.username,
      person,
      profile,
    };
  }

  private async buildRoleProfile(user: any) {
    const personId = user?.person?.id;
    const roleName = String(user?.role?.name ?? 'Usuario');
    const roleKey = roleName.toLowerCase();

    if (!personId) {
      return {
        type: this.mapRoleType(roleKey),
        roleLabel: roleName,
        code: user?.username ?? 'N/A',
      };
    }

    if (roleKey.includes('docente') || roleKey.includes('teacher')) {
      const teacher = await this.teacherRepository.findOne({
        where: { person: { id: personId } },
        relations: ['institution', 'person'],
      });

      if (teacher) {
        return {
          type: 'teacher',
          roleLabel: roleName,
          code: teacher.teacherCode,
          institution: teacher.institution?.name ?? null,
          details: {
            specialization: teacher.specialization,
            professionalTitle: teacher.professionalTitle,
            teachingLevel: teacher.teachingLevel,
            contractType: teacher.contractType,
            laborRegime: teacher.laborRegime,
            workloadType: teacher.workloadType,
            employmentStatus: teacher.employmentStatus,
          },
          stats: {
            weeklyHours: teacher.weeklyHours,
            graduationYear: teacher.graduationYear,
          },
        };
      }
    }

    if (roleKey.includes('alumno') || roleKey.includes('student')) {
      const student = await this.studentRepository.findOne({
        where: { person: { id: personId } },
        relations: ['institution', 'person'],
      });

      if (student) {
        return {
          type: 'student',
          roleLabel: roleName,
          code: student.studentCode,
          institution: student.institution?.name ?? null,
          details: {
            studentType: student.studentType,
            status: student.status,
            religion: student.religion,
            nativeLanguage: student.nativeLanguage,
            bloodType: student.bloodType,
          },
        };
      }
    }

    if (roleKey.includes('apoderado') || roleKey.includes('guardian') || roleKey.includes('tutor')) {
      const guardian = await this.guardianRepository.findOne({
        where: { person: { id: personId } },
        relations: ['person'],
      });

      if (guardian) {
        const dependents = await this.studentGuardianRepository.count({
          where: { guardian: { id: guardian.id } },
        });

        return {
          type: 'guardian',
          roleLabel: roleName,
          code: user?.username ?? guardian.id,
          details: {
            relationship: guardian.relationship,
            occupation: guardian.occupation,
            workplace: guardian.workplace,
            educationLevel: guardian.educationLevel,
            primaryGuardian: guardian.isPrimaryGuardian,
          },
          stats: {
            dependents,
            monthlyIncome: guardian.monthlyIncome,
          },
        };
      }
    }

    return {
      type: this.mapRoleType(roleKey),
      roleLabel: roleName,
      code: user?.username ?? 'N/A',
    };
  }

  private mapRoleType(roleKey: string) {
    if (roleKey.includes('admin')) return 'admin';
    if (roleKey.includes('director')) return 'director';
    if (roleKey.includes('docente') || roleKey.includes('teacher')) return 'teacher';
    if (roleKey.includes('alumno') || roleKey.includes('student')) return 'student';
    if (roleKey.includes('apoderado') || roleKey.includes('guardian')) return 'guardian';
    return 'user';
  }
}

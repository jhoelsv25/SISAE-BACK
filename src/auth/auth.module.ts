import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from '../config/jwt.config';
import { GuardianEntity } from '../features/guardians/entities/guardian.entity';
import { RolesModule } from '../features/roles/roles.module';
import { SessionsModule } from '../features/sessions/sessions.module';
import { GetModulesAndPermissionsByRoleIdUseCase } from '../features/roles/use-cases';
import { StudentGuardianEntity } from '../features/student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '../features/students/entities/student.entity';
import { TeacherEntity } from '../features/teachers/entities/teacher.entity';
import { UsersModule } from '../features/users/users.module';
import { AuthCookieService } from './auth-cookie.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

///@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    TypeOrmModule.forFeature([TeacherEntity, StudentEntity, GuardianEntity, StudentGuardianEntity]),
    UsersModule,
    RolesModule,
    SessionsModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthCookieService, GetModulesAndPermissionsByRoleIdUseCase],
})
export class AuthModule {}

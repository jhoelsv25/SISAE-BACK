import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from '../config/jwt.config';
import { RolesModule } from '../features/roles/roles.module';
import { RoleService } from '../features/roles/services/role.service';
import { GetModulesAndPermissionsByRoleIdUseCase } from '../features/roles/use-cases';
import { UsersModule } from '../features/users/users.module';
import { UsersService } from '../features/users/users.service';
import { AuthCookieService } from './auth-cookie.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

///@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    UsersModule,
    RolesModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    AuthCookieService,
    UsersService,
    RoleService,
    GetModulesAndPermissionsByRoleIdUseCase,
  ],
})
export class AuthModule {}

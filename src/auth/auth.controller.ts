import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorHandler } from '../common/exceptions';
import { AuthCookieService } from './auth-cookie.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    const { accessToken, refreshToken, user, modules } = result.data;

    // Establecer cookies
    await this.authCookieService.setAuthCookies(res, accessToken, refreshToken);

    // NestJS manejará automáticamente la serialización
    return { message: result.message, user, accessToken, modules };
  }

  @Post('refresh-token')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      ErrorHandler.unauthorized('No se proporcionó el refresh token', 'RefreshToken');
    }

    const result = await this.authService.refresh(refreshToken);
    const { accessToken } = result.data;

    // Establecer cookies
    await this.authCookieService.setAuthCookies(res, accessToken, refreshToken);

    // NestJS manejará automáticamente la serialización
    return result;
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authCookieService.clearAuthCookies(res);
    return await this.authService.logout();
  }

  @Get('check-token')
  async checkToken(@Req() req: Request) {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      ErrorHandler.unauthorized('No se proporcionó el access token', 'CheckToken');
    }

    return await this.authService.checkToken(accessToken);
  }

  @Get('modules/:id')
  async getModulesByRole(@Param('id') roleId: string) {
    return await this.authService.getModulesByRole(roleId);
  }
}

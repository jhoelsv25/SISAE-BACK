import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
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
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto);
    const { accessToken, refreshToken, user } = result.data;
    await this.authCookieService.setAuthCookies(res, accessToken, refreshToken);
    res.json({ message: result.message, user, accessToken });
  }

  @Post('refresh-token')
  async refresh(@Req() req: Request, @Res() res: Response) {
    console.log('Cookies recibidas:', req.cookies);
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: 'No se proporcionó el refresh token',
        cookies: req.cookies,
        headers: req.headers,
      });
    }
    const result = await this.authService.refresh(refreshToken);
    const { accessToken } = result.data;
    await this.authCookieService.setAuthCookies(res, accessToken, refreshToken);
    res.json(result);
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    this.authCookieService.clearAuthCookies(res);
    res.json(await this.authService.logout());
  }

  @Get('modules/:id')
  async getModulesByRole(@Param('id') roleId: string) {
    return await this.authService.getModulesByRole(roleId);
  }
}

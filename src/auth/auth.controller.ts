import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
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
    this.authCookieService.setAuthCookies(res, accessToken, refreshToken);
    return res.json({ message: result.message, user, accessToken, refreshToken });
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No se proporcionó el refresh token' });
    }
    const result = await this.authService.refresh(refreshToken);
    this.authCookieService.setAuthCookies(res, result.accessToken, refreshToken);
    return res.json({ message: result.message });
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    this.authCookieService.clearAuthCookies(res);
    return res.json(await this.authService.logout());
  }
}

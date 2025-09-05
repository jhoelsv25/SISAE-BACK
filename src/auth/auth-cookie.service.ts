import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthCookieService {
  async setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60, // 1 hora
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      sameSite: 'strict',
    });
  }

  async clearAuthCookies(res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}

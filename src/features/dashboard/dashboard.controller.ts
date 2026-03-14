import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ErrorHandler } from '@common/exceptions';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@Req() req: Request) {
    const user = req.user as { id?: string } | undefined;
    if (!user?.id) {
      ErrorHandler.unauthorized('Sesion invalida', 'Dashboard');
    }
    return this.dashboardService.getDashboard(String(user.id));
  }
}

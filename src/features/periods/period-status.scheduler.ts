import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PeriodsService } from './periods.service';

@Injectable()
export class PeriodStatusScheduler implements OnModuleInit {
  private readonly logger = new Logger(PeriodStatusScheduler.name);

  constructor(private readonly periodsService: PeriodsService) {}

  async onModuleInit(): Promise<void> {
    const result = await this.periodsService.syncStatusesWithCalendar();
    this.logger.log(`Sincronización inicial de períodos completada: ${result.updated} cambio(s)`);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncStatuses(): Promise<void> {
    const result = await this.periodsService.syncStatusesWithCalendar();
    if (result.updated > 0) {
      this.logger.log(`Estados de períodos sincronizados automáticamente: ${result.updated}`);
    }
  }
}

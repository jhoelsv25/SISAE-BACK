import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { ReportsService, type GenerateReportJobPayload } from './reports.service';

@Processor(QUEUE.REPORTS, { concurrency: 2 })
export class ReportsProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportsProcessor.name);

  constructor(private readonly reportsService: ReportsService) {
    super();
  }

  async process(job: Job<GenerateReportJobPayload, unknown>): Promise<unknown> {
    switch (job.name) {
      case JOBS.GENERATE_REPORT:
        return this.reportsService.processQueuedReport(job.data);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
        return undefined;
    }
  }
}

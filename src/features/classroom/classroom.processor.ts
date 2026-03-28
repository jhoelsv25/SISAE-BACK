import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { ClassroomService, type PublishScheduledTaskJobPayload } from './classroom.service';

@Processor(QUEUE.CLASSROOM, { concurrency: 2 })
export class ClassroomProcessor extends WorkerHost {
  private readonly logger = new Logger(ClassroomProcessor.name);

  constructor(private readonly classroomService: ClassroomService) {
    super();
  }

  async process(job: Job<PublishScheduledTaskJobPayload, unknown>): Promise<unknown> {
    switch (job.name) {
      case JOBS.PUBLISH_SCHEDULED_TASK:
        return this.classroomService.publishScheduledTask(job.data);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
        return undefined;
    }
  }
}

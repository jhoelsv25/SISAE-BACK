import { PartialType } from '@nestjs/swagger';
import { CreateEmailLogDto } from './create-email_log.dto';

export class UpdateEmailLogDto extends PartialType(CreateEmailLogDto) {}

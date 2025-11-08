import { PartialType } from '@nestjs/swagger';
import { CreateForumThreadDto } from './create-forum_thread.dto';

export class UpdateForumThreadDto extends PartialType(CreateForumThreadDto) {}

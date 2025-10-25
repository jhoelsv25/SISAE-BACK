import { PartialType } from '@nestjs/swagger';
import { CreateForumPostDto } from './create-forum_post.dto';

export class UpdateForumPostDto extends PartialType(CreateForumPostDto) {}

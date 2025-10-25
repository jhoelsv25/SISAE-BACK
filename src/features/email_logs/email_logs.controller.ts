import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailLogsService } from './email_logs.service';
import { CreateEmailLogDto } from './dto/create-email_log.dto';
import { UpdateEmailLogDto } from './dto/update-email_log.dto';

@Controller('email-logs')
export class EmailLogsController {
  constructor(private readonly emailLogsService: EmailLogsService) {}

  @Post()
  create(@Body() createEmailLogDto: CreateEmailLogDto) {
    return this.emailLogsService.create(createEmailLogDto);
  }

  @Get()
  findAll() {
    return this.emailLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailLogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailLogDto: UpdateEmailLogDto) {
    return this.emailLogsService.update(+id, updateEmailLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailLogsService.remove(+id);
  }
}

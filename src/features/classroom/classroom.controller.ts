import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ClassroomService } from './classroom.service';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get('feed/:sectionCourseId')
  getFeed(@Param('sectionCourseId') sectionId: string) {
    return this.classroomService.getFeed(sectionId);
  }

  @Get('chat/:sectionCourseId')
  getChat(@Param('sectionCourseId') sectionId: string) {
    return this.classroomService.getChatHistory(sectionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('publish')
  publish(@Request() req: any, @Body() body: { sectionCourseId: string; content: string; attachmentUrl?: string }) {
    const userId = req.user.id;
    return this.classroomService.publishPost(userId, body.sectionCourseId, body.content, body.attachmentUrl);
  }
}

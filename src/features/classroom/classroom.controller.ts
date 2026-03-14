import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
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
  @Get(':sectionCourseId/teachers')
  getTeachers(@Param('sectionCourseId') sectionId: string) {
    return this.classroomService.getTeachers(sectionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':sectionCourseId/people')
  getPeople(@Request() req: any, @Param('sectionCourseId') sectionId: string) {
    return this.classroomService.getPeople(sectionId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':sectionCourseId/tasks')
  getTasks(@Request() req: any, @Param('sectionCourseId') sectionId: string) {
    return this.classroomService.getTasks(sectionId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':sectionCourseId/tasks/:assignmentId/submit')
  submitTask(
    @Request() req: any,
    @Param('sectionCourseId') sectionId: string,
    @Param('assignmentId') assignmentId: string,
    @Body()
    body: {
      submissionText?: string;
      fileUrl?: string;
      fileName?: string;
      linkUrl?: string;
    },
  ) {
    return this.classroomService.submitTask(req.user?.id, sectionId, assignmentId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':sectionCourseId/tasks/:assignmentId/submissions/:submissionId/review')
  reviewTaskSubmission(
    @Request() req: any,
    @Param('sectionCourseId') sectionId: string,
    @Param('assignmentId') assignmentId: string,
    @Param('submissionId') submissionId: string,
    @Body()
    body: {
      score: number;
      feedback?: string;
    },
  ) {
    return this.classroomService.reviewTaskSubmission(
      req.user?.id,
      sectionId,
      assignmentId,
      submissionId,
      body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':sectionCourseId/grades')
  getGrades(@Request() req: any, @Param('sectionCourseId') sectionId: string) {
    return this.classroomService.getGrades(sectionId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('publish')
  publish(@Request() req: any, @Body() body: { sectionCourseId: string; content: string; attachmentUrl?: string }) {
    const userId = req.user.id;
    return this.classroomService.publishPost(userId, body.sectionCourseId, body.content, body.attachmentUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('chat/:sectionCourseId')
  sendChatMessage(@Request() req: any, @Param('sectionCourseId') sectionId: string, @Body() body: { content: string }) {
    const userId = req.user.id;
    return this.classroomService.sendChatMessage(userId, sectionId, body.content);
  }
}

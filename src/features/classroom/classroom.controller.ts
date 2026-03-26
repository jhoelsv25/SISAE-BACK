import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ClassroomService } from './classroom.service';

const SectionCourseIdParam = () => Param('sectionCourseId', new ParseUUIDPipe({ version: '4' }));
const PostIdParam = () => Param('postId', new ParseUUIDPipe({ version: '4' }));
const CommentIdParam = () => Param('commentId', new ParseUUIDPipe({ version: '4' }));

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @UseGuards(JwtAuthGuard)
  @Get('feed/:sectionCourseId')
  getFeed(@Request() req: any, @SectionCourseIdParam() sectionId: string) {
    return this.classroomService.getFeed(sectionId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('chat/:sectionCourseId')
  getChat(@Request() req: any, @SectionCourseIdParam() sectionId: string) {
    return this.classroomService.getChatHistory(sectionId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':sectionCourseId/teachers')
  getTeachers(@Request() req: any, @SectionCourseIdParam() sectionId: string) {
    return this.classroomService.getTeachers(sectionId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':sectionCourseId/people')
  getPeople(@Request() req: any, @SectionCourseIdParam() sectionId: string) {
    return this.classroomService.getPeople(sectionId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':sectionCourseId/tasks')
  getTasks(@Request() req: any, @SectionCourseIdParam() sectionId: string) {
    return this.classroomService.getTasks(sectionId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':sectionCourseId/tasks/:assignmentId/editor')
  getTaskEditor(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.classroomService.getTaskEditor(req.user?.id, sectionId, assignmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':sectionCourseId/tasks/:assignmentId/submit')
  submitTask(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @Param('assignmentId') assignmentId: string,
    @Body()
    body: {
      submissionText?: string;
      fileUrl?: string;
      fileName?: string;
      linkUrl?: string;
      answers?: Array<{
        questionId: string;
        selectedOptionIds?: string[];
        answerText?: string;
      }>;
    },
  ) {
    return this.classroomService.submitTask(req.user?.id, sectionId, assignmentId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':sectionCourseId/tasks/:assignmentId/submissions/:submissionId/review')
  reviewTaskSubmission(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
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
  @Post(':sectionCourseId/tasks/:assignmentId/comments')
  createTaskComment(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @Param('assignmentId') assignmentId: string,
    @Body() body: { content: string },
  ) {
    return this.classroomService.createTaskComment(req.user.id, sectionId, assignmentId, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':sectionCourseId/tasks/:assignmentId/comments/:commentId')
  updateTaskComment(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @Param('assignmentId') assignmentId: string,
    @CommentIdParam() commentId: string,
    @Body() body: { content: string },
  ) {
    return this.classroomService.updateTaskComment(req.user.id, sectionId, assignmentId, commentId, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':sectionCourseId/tasks/:assignmentId/comments/:commentId')
  deleteTaskComment(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @Param('assignmentId') assignmentId: string,
    @CommentIdParam() commentId: string,
  ) {
    return this.classroomService.deleteTaskComment(req.user.id, sectionId, assignmentId, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':sectionCourseId/grades')
  getGrades(@Request() req: any, @SectionCourseIdParam() sectionId: string) {
    return this.classroomService.getGrades(sectionId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('publish')
  publish(
    @Request() req: any,
    @Body() body: { sectionCourseId: string; content: string; attachmentUrl?: string },
  ) {
    const userId = req.user.id;
    return this.classroomService.publishPost(userId, body.sectionCourseId, body.content, body.attachmentUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':sectionCourseId/posts/:postId/comments')
  createComment(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @PostIdParam() postId: string,
    @Body() body: { content: string },
  ) {
    return this.classroomService.createComment(req.user.id, sectionId, postId, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':sectionCourseId/posts/:postId')
  updatePost(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @PostIdParam() postId: string,
    @Body() body: { content?: string; attachmentUrl?: string | null },
  ) {
    return this.classroomService.updatePost(req.user.id, sectionId, postId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':sectionCourseId/posts/:postId')
  deletePost(@Request() req: any, @SectionCourseIdParam() sectionId: string, @PostIdParam() postId: string) {
    return this.classroomService.deletePost(req.user.id, sectionId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':sectionCourseId/posts/:postId/comments/:commentId')
  updateComment(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @PostIdParam() postId: string,
    @CommentIdParam() commentId: string,
    @Body() body: { content: string },
  ) {
    return this.classroomService.updateComment(req.user.id, sectionId, postId, commentId, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':sectionCourseId/posts/:postId/comments/:commentId')
  deleteComment(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @PostIdParam() postId: string,
    @CommentIdParam() commentId: string,
  ) {
    return this.classroomService.deleteComment(req.user.id, sectionId, postId, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':sectionCourseId/tasks')
  createTask(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @Body()
    body: {
      title: string;
      description?: string;
      instructions?: string;
      dueDate: string;
      maxScore?: number;
      lateSubmissionAllowed?: boolean;
      maxAttempts?: number;
      type?: string;
      resourceUrl?: string;
      questions?: Array<{
        prompt: string;
        type: 'single_choice' | 'multiple_choice' | 'short_answer';
        points?: number;
        required?: boolean;
        options?: Array<{ label: string; isCorrect?: boolean }>;
      }>;
    },
  ) {
    return this.classroomService.createTask(req.user.id, sectionId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':sectionCourseId/tasks/:assignmentId')
  updateTask(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @Param('assignmentId') assignmentId: string,
    @Body()
    body: {
      title: string;
      description?: string;
      instructions?: string;
      dueDate: string;
      maxScore?: number;
      lateSubmissionAllowed?: boolean;
      maxAttempts?: number;
      type?: string;
      resourceUrl?: string;
      questions?: Array<{
        prompt: string;
        type: 'single_choice' | 'multiple_choice' | 'short_answer';
        points?: number;
        required?: boolean;
        options?: Array<{ label: string; isCorrect?: boolean }>;
      }>;
    },
  ) {
    return this.classroomService.updateTask(req.user.id, sectionId, assignmentId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':sectionCourseId/tasks/:assignmentId')
  deleteTask(
    @Request() req: any,
    @SectionCourseIdParam() sectionId: string,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.classroomService.deleteTask(req.user.id, sectionId, assignmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('chat/:sectionCourseId')
  sendChatMessage(@Request() req: any, @SectionCourseIdParam() sectionId: string, @Body() body: { content: string }) {
    const userId = req.user.id;
    return this.classroomService.sendChatMessage(userId, sectionId, body.content);
  }
}

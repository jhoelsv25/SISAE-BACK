import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { AssigmentEntity } from '../assigments/entities/assigment.entity';
import { AssigmentQuestionEntity } from '../assigments/entities/assigment_question.entity';
import { AssigmentQuestionOptionEntity } from '../assigments/entities/assigment_question_option.entity';
import { AssigmentStatus, AssigmentType } from '../assigments/enums/assigment.enum';
import { AssigmentQuestionType } from '../assigments/enums/assigment-question.enum';
import { AssigmentSubmissionEntity } from '../assigment_submissions/entities/assigment_submission.entity';
import { AssigmentSubmissionStatus } from '../assigment_submissions/enums/assigment_submission.enum';
import { AssessmentConsolidationService } from '../assessment_scores/assessment-consolidation.service';
import { AssessmentScoreEntity } from '../assessment_scores/entities/assessment_score.entity';
import { AssessmentEntity } from '../assessments/entities/assessment.entity';
import { AssessmentStatus, AssessmentType } from '../assessments/enums/assessment.enum';
import { ChatMessageEntity } from '../chat_messages/entities/chat_message.entity';
import { ChatMessageType } from '../chat_messages/enums/chat_message.enum';
import { ChatRoomType } from '../chat_rooms/enums/chat_room.enum';
import { ChatRoomEntity } from '../chat_rooms/entities/chat_room.entity';
import { EnrollmentEntity } from '../enrollments/entities/enrollment.entity';
import { GuardianEntity } from '../guardians/entities/guardian.entity';
import { LearningMaterialEntity } from '../learning_materials/entities/learning_material.entity';
import { PeriodEntity } from '../periods/entities/period.entity';
import { SectionCourseEntity } from '../section-course/entities/section-course.entity';
import { StudentGuardianEntity } from '../student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '../students/entities/student.entity';
import { TeacherEntity } from '../teachers/entities/teacher.entity';
import { UserEntity } from '../users/entities/user.entity';
import { VirtualClassroomEntity } from '../virtual_classrooms/entities/virtual_classroom.entity';
import { ClassroomCommentEntity } from './entities/classroom-comment.entity';
import { ClassroomPostEntity } from './entities/classroom-post.entity';
import { TaskCommentEntity } from './entities/task-comment.entity';

@Injectable()
export class ClassroomService {
  private readonly logger = new Logger(ClassroomService.name);

  constructor(
    @InjectRepository(ClassroomPostEntity)
    private readonly postRepo: Repository<ClassroomPostEntity>,
    @InjectRepository(ClassroomCommentEntity)
    private readonly commentRepo: Repository<ClassroomCommentEntity>,
    @InjectRepository(TaskCommentEntity)
    private readonly taskCommentRepo: Repository<TaskCommentEntity>,
    @InjectRepository(LearningMaterialEntity)
    private readonly materialRepo: Repository<LearningMaterialEntity>,
    @InjectRepository(AssigmentEntity)
    private readonly assignmentRepo: Repository<AssigmentEntity>,
    @InjectRepository(AssigmentQuestionEntity)
    private readonly assignmentQuestionRepo: Repository<AssigmentQuestionEntity>,
    @InjectRepository(AssigmentQuestionOptionEntity)
    private readonly assignmentQuestionOptionRepo: Repository<AssigmentQuestionOptionEntity>,
    @InjectRepository(AssigmentSubmissionEntity)
    private readonly assignmentSubmissionRepo: Repository<AssigmentSubmissionEntity>,
    @InjectRepository(AssessmentEntity)
    private readonly assessmentRepo: Repository<AssessmentEntity>,
    @InjectRepository(AssessmentScoreEntity)
    private readonly assessmentScoreRepo: Repository<AssessmentScoreEntity>,
    @InjectRepository(PeriodEntity)
    private readonly periodRepo: Repository<PeriodEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly chatRepo: Repository<ChatMessageEntity>,
    @InjectRepository(ChatRoomEntity)
    private readonly roomRepo: Repository<ChatRoomEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepo: Repository<EnrollmentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepo: Repository<StudentEntity>,
    @InjectRepository(GuardianEntity)
    private readonly guardianRepo: Repository<GuardianEntity>,
    @InjectRepository(StudentGuardianEntity)
    private readonly studentGuardianRepo: Repository<StudentGuardianEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(SectionCourseEntity)
    private readonly sectionCourseRepo: Repository<SectionCourseEntity>,
    @InjectRepository(VirtualClassroomEntity)
    private readonly virtualClassroomRepo: Repository<VirtualClassroomEntity>,
    private readonly assessmentConsolidationService: AssessmentConsolidationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private personFullName(person?: { firstName?: string; lastName?: string } | null) {
    return [person?.firstName, person?.lastName].filter(Boolean).join(' ').trim();
  }

  private userDisplay(user?: UserEntity | null) {
    return this.personFullName(user?.person) || user?.username || 'Usuario';
  }

  private teacherDisplay(teacher?: { person?: { firstName?: string; lastName?: string; photoUrl?: string } } | null) {
    return this.personFullName(teacher?.person) || 'Docente';
  }

  private isAdminLike(roleName: string) {
    return roleName.includes('admin') || roleName.includes('director');
  }

  private isTeacherLike(roleName: string) {
    return roleName.includes('docente') || roleName.includes('teacher');
  }

  private isStudentLike(roleName: string) {
    return roleName.includes('alumno') || roleName.includes('student');
  }

  private isGuardianLike(roleName: string) {
    return roleName.includes('apoderado') || roleName.includes('guardian') || roleName.includes('tutor');
  }

  private inferAttachmentName(url?: string) {
    if (!url) return 'Recurso';

    try {
      const normalized = url.startsWith('http') ? url : `http://local${url}`;
      const parsed = new URL(normalized);
      const pathname = parsed.pathname || '';
      const lastSegment = pathname.split('/').filter(Boolean).pop();

      if (lastSegment) {
        return decodeURIComponent(lastSegment);
      }

      return parsed.hostname.replace(/^www\./, '') || 'Recurso';
    } catch {
      const segment = url.split('/').filter(Boolean).pop();
      return segment || 'Recurso';
    }
  }

  private async resolveSectionCourseId(classroomId: string): Promise<string> {
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: classroomId },
      select: ['id'],
    });

    if (sectionCourse?.id) {
      return sectionCourse.id;
    }

    const virtualClassroom = await this.virtualClassroomRepo.findOne({
      where: { id: classroomId },
      relations: ['sectionCourse'],
    });

    if (virtualClassroom?.sectionCourse?.id) {
      return virtualClassroom.sectionCourse.id;
    }

    throw new ErrorHandler('Aula virtual no encontrada', 404);
  }

  private async ensureClassroomAccess(
    userId: string | undefined,
    classroomId: string,
    mode: 'view' | 'publish' | 'submit' | 'review' | 'comment' = 'view',
  ) {
    if (!userId) {
      throw new ErrorHandler('No autorizado', 401);
    }

    const sectionCourseId = await this.resolveSectionCourseId(classroomId);

    const [user, sectionCourse] = await Promise.all([
      this.userRepo.findOne({
        where: { id: userId },
        relations: ['person', 'role'],
      }),
      this.sectionCourseRepo.findOne({
        where: { id: sectionCourseId },
        relations: ['teacher', 'teacher.person', 'section', 'academicYear'],
      }),
    ]);

    if (!user || !sectionCourse) {
      throw new ErrorHandler('Aula virtual no encontrada', 404);
    }

    const roleName = String(user.role?.name ?? '').toLowerCase();
    const personId = user.person?.id;

    if (this.isAdminLike(roleName)) {
      return { user, sectionCourse };
    }

    if (this.isTeacherLike(roleName)) {
      if (!personId || sectionCourse.teacher?.person?.id !== personId) {
        throw new ErrorHandler('No tienes acceso a esta aula virtual', 403);
      }
      return { user, sectionCourse };
    }

    if (this.isStudentLike(roleName)) {
      if (mode === 'publish' || mode === 'review') {
        throw new ErrorHandler('No tienes permisos para esta acción', 403);
      }

      const student = personId
        ? await this.studentRepo.findOne({ where: { person: { id: personId } } })
        : null;

      if (!student) {
        throw new ErrorHandler('No tienes acceso a esta aula virtual', 403);
      }

      const enrollment = await this.enrollmentRepo.findOne({
        where: {
          student: { id: student.id },
          section: { id: sectionCourse.section?.id },
          academicYear: { id: sectionCourse.academicYear?.id },
        },
      });

      if (!enrollment) {
        throw new ErrorHandler('No tienes acceso a esta aula virtual', 403);
      }

      return { user, sectionCourse };
    }

    if (this.isGuardianLike(roleName)) {
      if (mode !== 'view') {
        throw new ErrorHandler('No tienes permisos para esta acción', 403);
      }

      const guardian = personId
        ? await this.guardianRepo.findOne({ where: { person: { id: personId } } })
        : null;

      if (!guardian) {
        throw new ErrorHandler('No tienes acceso a esta aula virtual', 403);
      }

      const links = await this.studentGuardianRepo.find({
        where: { guardian: { id: guardian.id } },
        relations: ['student'],
      });

      const studentIds = links.map((link) => link.student?.id).filter(Boolean) as string[];
      if (!studentIds.length) {
        throw new ErrorHandler('No tienes acceso a esta aula virtual', 403);
      }

      const enrollment = await this.enrollmentRepo.findOne({
        where: {
          student: { id: In(studentIds) },
          section: { id: sectionCourse.section?.id },
          academicYear: { id: sectionCourse.academicYear?.id },
        },
      });

      if (!enrollment) {
        throw new ErrorHandler('No tienes acceso a esta aula virtual', 403);
      }

      return { user, sectionCourse };
    }

    throw new ErrorHandler('No tienes acceso a esta aula virtual', 403);
  }

  private canManagePost(user: UserEntity | null | undefined, post: ClassroomPostEntity) {
    const roleName = String(user?.role?.name ?? '').toLowerCase();
    if (this.isAdminLike(roleName)) return true;
    return Boolean(user?.id && post.user?.id === user.id);
  }

  private canManageComment(user: UserEntity | null | undefined, comment: ClassroomCommentEntity) {
    const roleName = String(user?.role?.name ?? '').toLowerCase();
    if (this.isAdminLike(roleName)) return true;
    return Boolean(user?.id && comment.user?.id === user.id);
  }

  private canManageTaskComment(user: UserEntity | null | undefined, comment: TaskCommentEntity) {
    const roleName = String(user?.role?.name ?? '').toLowerCase();
    if (this.isAdminLike(roleName)) return true;
    return Boolean(user?.id && comment.user?.id === user.id);
  }

  private gradeScaleLabel(
    score: number,
    gradeScales: Array<{ label: string; minScore: number; maxScore: number }> = [],
  ) {
    const numericScore = Number(score);
    if (!gradeScales.length || Number.isNaN(numericScore)) return undefined;
    const matched = gradeScales.find(
      (scale) => numericScore >= Number(scale.minScore) && numericScore <= Number(scale.maxScore),
    );
    return matched?.label;
  }

  async getFeed(sectionCourseId: string, userId?: string) {
    try {
      const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
      await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'view');
      const posts = await this.postRepo.find({
        where: { sectionCourse: { id: resolvedSectionCourseId } },
        relations: ['user', 'user.person', 'user.role', 'comments', 'comments.user', 'comments.user.person', 'comments.user.role'],
        order: { createdAt: 'DESC' },
      });

      const materials = await this.materialRepo.find({
        where: { sectionCourse: { id: resolvedSectionCourseId } },
        relations: ['teacher', 'teacher.person'],
        order: { id: 'DESC' },
      });

      const assignments = await this.assignmentRepo.find({
        where: { sectionCourse: { id: resolvedSectionCourseId } },
        relations: ['teacher', 'teacher.person'],
        order: { id: 'DESC' },
      });

      const feed = [
        ...posts.map(p => ({
          id: p.id,
          type: 'post',
          content: p.content,
          date: (p as any).createdAt || new Date(),
          attachmentUrl: p.attachmentUrl,
          author: { 
            id: p.user?.id,
            name: this.userDisplay(p.user),
            avatar: p.user?.person?.photoUrl || undefined,
            role: p.user?.role?.name || 'Publicacion',
          },
          comments: p.comments.map(c => ({
            id: c.id,
            content: c.content,
            date: (c as any).createdAt || new Date(),
            author: {
              id: c.user?.id,
              name: c.user?.person ? `${c.user.person.firstName} ${c.user.person.lastName}` : c.user?.username,
              avatar: c.user?.person?.photoUrl || undefined,
              role: c.user?.role?.name || 'Comentario',
            },
          })),
          metadata: {
            attachments: p.attachmentUrl
              ? [{ url: p.attachmentUrl, name: this.inferAttachmentName(p.attachmentUrl) }]
              : [],
          },
          commentsCount: p.comments.length
        })),
        ...materials.map(m => ({
          id: m.id,
          type: 'material',
          title: m.title,
          content: m.description,
          date: (m as any).createdAt || new Date(),
          url: m.url,
          author: {
            name: this.teacherDisplay(m.teacher),
            avatar: m.teacher?.person?.photoUrl || undefined,
            role: 'Material',
          },
          commentsCount: 0
        })),
        ...assignments.map(a => ({
          id: a.id,
          type: 'assignment',
          title: a.title,
          content: a.description,
          date: a.assignedDate || (a as any).createdAt || new Date(),
          dueDate: a.dueDate,
          author: {
            name: this.teacherDisplay(a.teacher),
            avatar: a.teacher?.person?.photoUrl || undefined,
            role: 'Tarea',
          },
          commentsCount: 0
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return { data: feed };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Error al obtener feed: ' + error.message, 500);
    }
  }

  async publishPost(userId: string, sectionCourseId: string, content: string, attachmentUrl?: string) {
    try {
      const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
      await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'publish');

      const post = this.postRepo.create({
        content,
        attachmentUrl,
        user: { id: userId },
        sectionCourse: { id: resolvedSectionCourseId }
      });
      return await this.postRepo.save(post);
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Error al publicar post: ' + error.message, 500);
    }
  }

  async createComment(userId: string, sectionCourseId: string, postId: string, content: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    const access = await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'comment');
    const trimmed = content?.trim();

    if (!trimmed) {
      throw new ErrorHandler('El comentario es obligatorio', 400);
    }

    const post = await this.postRepo.findOne({
      where: { id: postId, sectionCourse: { id: resolvedSectionCourseId } },
    });

    if (!post) {
      throw new ErrorHandler('Publicacion no encontrada', 404);
    }

    const comment = this.commentRepo.create({
      content: trimmed,
      post: { id: post.id },
      user: { id: access.user.id },
    });

    await this.commentRepo.save(comment);
    return this.getFeedItemByPostId(post.id);
  }

  async updatePost(
    userId: string,
    sectionCourseId: string,
    postId: string,
    body: { content?: string; attachmentUrl?: string | null },
  ) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    const access = await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'publish');
    const post = await this.postRepo.findOne({
      where: { id: postId, sectionCourse: { id: resolvedSectionCourseId } },
      relations: ['user', 'user.role'],
    });

    if (!post) {
      throw new ErrorHandler('Publicacion no encontrada', 404);
    }

    if (!this.canManagePost(access.user, post)) {
      throw new ErrorHandler('No puedes editar esta publicacion', 403);
    }

    const nextContent = body.content?.trim() ?? post.content;
    if (!nextContent && !body.attachmentUrl && !post.attachmentUrl) {
      throw new ErrorHandler('La publicacion no puede quedar vacia', 400);
    }

    post.content = nextContent;
    if (body.attachmentUrl !== undefined) {
      post.attachmentUrl = body.attachmentUrl || null;
    }

    await this.postRepo.save(post);
    return this.getFeedItemByPostId(post.id);
  }

  async deletePost(userId: string, sectionCourseId: string, postId: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    const access = await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'publish');
    const post = await this.postRepo.findOne({
      where: { id: postId, sectionCourse: { id: resolvedSectionCourseId } },
      relations: ['user', 'user.role'],
    });

    if (!post) {
      throw new ErrorHandler('Publicacion no encontrada', 404);
    }

    if (!this.canManagePost(access.user, post)) {
      throw new ErrorHandler('No puedes eliminar esta publicacion', 403);
    }

    await this.commentRepo
      .createQueryBuilder()
      .delete()
      .from(ClassroomCommentEntity)
      .where(`"postId" = :postId`, { postId: post.id })
      .execute();

    await this.postRepo.remove(post);
    return { id: post.id, deleted: true };
  }

  async updateComment(userId: string, sectionCourseId: string, postId: string, commentId: string, content: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    const access = await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'comment');
    const trimmed = content?.trim();

    if (!trimmed) {
      throw new ErrorHandler('El comentario es obligatorio', 400);
    }

    const comment = await this.commentRepo.findOne({
      where: {
        id: commentId,
        post: { id: postId, sectionCourse: { id: resolvedSectionCourseId } },
      },
      relations: ['user', 'user.role', 'post'],
    });

    if (!comment) {
      throw new ErrorHandler('Comentario no encontrado', 404);
    }

    if (!this.canManageComment(access.user, comment)) {
      throw new ErrorHandler('No puedes editar este comentario', 403);
    }

    comment.content = trimmed;
    await this.commentRepo.save(comment);
    return this.getFeedItemByPostId(postId);
  }

  async deleteComment(userId: string, sectionCourseId: string, postId: string, commentId: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    const access = await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'comment');
    const comment = await this.commentRepo.findOne({
      where: {
        id: commentId,
        post: { id: postId, sectionCourse: { id: resolvedSectionCourseId } },
      },
      relations: ['user', 'user.role'],
    });

    if (!comment) {
      throw new ErrorHandler('Comentario no encontrado', 404);
    }

    if (!this.canManageComment(access.user, comment)) {
      throw new ErrorHandler('No puedes eliminar este comentario', 403);
    }

    await this.commentRepo.remove(comment);
    return this.getFeedItemByPostId(postId);
  }

  async getFeedItemByPostId(postId: string) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['user', 'user.person', 'user.role', 'comments', 'comments.user', 'comments.user.person', 'comments.user.role'],
    });

    if (!post) {
      throw new ErrorHandler('Publicacion no encontrada', 404);
    }

    return this.mapPostToFeedItem(post);
  }

  async getChatHistory(sectionCourseId: string, userId?: string) {
    try {
      const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
      await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'view');
      const room = await this.roomRepo.findOne({ where: { sectionCourse: { id: resolvedSectionCourseId } } });
      if (!room) return { data: [] };

      const messages = await this.chatRepo.find({
        where: { chatRoom: { id: room.id } },
        relations: ['user', 'user.person'],
        order: { id: 'ASC' },
        take: 50,
      });

      return {
        data: messages.map((message) => this.mapChatMessage(message))
      };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Error al obtener chat: ' + error.message, 500);
    }
  }

  async saveMessage(userId: string, sectionCourseId: string, content: string) {
    try {
      const room = await this.ensureChatRoom(sectionCourseId);

      const message = this.chatRepo.create({
        content,
        user: { id: userId },
        chatRoom: { id: room.id },
        type: ChatMessageType.TEXT,
        fileUrl: '',
        fileName: '',
        fileSizeMB: 0,
      });

      return await this.chatRepo.save(message);
    } catch (error) {
       console.error('Error saving chat message', error);
       return null;
    }
  }

  async sendChatMessage(userId: string, sectionCourseId: string, content: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'view');
    const message = await this.saveMessage(userId, resolvedSectionCourseId, content);
    if (!message) {
      throw new ErrorHandler('Error al enviar mensaje', 500);
    }

    const fullMessage = await this.chatRepo.findOne({
      where: { id: message.id },
      relations: ['user', 'user.person'],
    });

    return {
      id: fullMessage?.id,
      ...this.mapChatMessage(fullMessage),
    };
  }

  async getTeachers(sectionCourseId: string, userId?: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'view');
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: resolvedSectionCourseId },
      relations: ['teacher', 'teacher.person', 'academicYear'],
    });

    if (!sectionCourse?.teacher?.person) {
      return [];
    }

    const teacher = sectionCourse.teacher;
    return [
      {
        id: teacher.id,
        firstName: teacher.person.firstName,
        lastName: teacher.person.lastName,
        email: teacher.person.email,
        photoUrl: teacher.person.photoUrl,
        role: 'Docente',
      },
    ];
  }

  async getPeople(sectionCourseId: string, userId?: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'view');
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: resolvedSectionCourseId },
      relations: ['section', 'academicYear'],
    });

    if (!sectionCourse?.section?.id) {
      return { teachers: [], students: [] };
    }

    const [teachers, allowedStudentIds, enrollments] = await Promise.all([
      this.getTeachers(resolvedSectionCourseId, userId),
      this.getAllowedStudentIds(userId),
      this.enrollmentRepo.find({
        where: {
          section: { id: sectionCourse.section.id },
          academicYear: { id: sectionCourse.academicYear?.id },
        },
        relations: ['student', 'student.person'],
        order: { orderNumber: 'ASC' },
      }),
    ]);

    const visibleEnrollments = allowedStudentIds === null
      ? enrollments
      : enrollments.filter((item) => allowedStudentIds.includes(item.student?.id));

    return {
      teachers,
      students: visibleEnrollments.map((enrollment) => ({
        id: enrollment.student?.id,
        name: enrollment.student?.person
          ? `${enrollment.student.person.firstName} ${enrollment.student.person.lastName}`
          : enrollment.student?.studentCode ?? 'Estudiante',
        code: enrollment.student?.studentCode ?? '',
        photoUrl: enrollment.student?.person?.photoUrl ?? '',
        status: enrollment.status,
      })),
    };
  }

  async getTasks(sectionCourseId: string, userId?: string) {
    try {
      const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
      await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'view');
      const sectionCourse = await this.sectionCourseRepo.findOne({
        where: { id: resolvedSectionCourseId },
        relations: ['section', 'academicYear'],
      });

      let assignments: AssigmentEntity[];
      try {
        assignments = await this.assignmentRepo.find({
          where: { sectionCourse: { id: resolvedSectionCourseId } },
          relations: ['questions', 'questions.options'],
          order: { dueDate: 'ASC' },
        });
      } catch (err) {
        const msg = String(err?.message ?? err);
        if (msg.includes('assigment_questions') || msg.includes('does not exist')) {
          assignments = await this.assignmentRepo.find({
            where: { sectionCourse: { id: resolvedSectionCourseId } },
            order: { dueDate: 'ASC' },
          });
        } else {
          throw new ErrorHandler('Error al obtener tareas: ' + msg, 500);
        }
      }

      const [allowedStudentIds, user] = await Promise.all([
        this.getAllowedStudentIds(userId),
        userId
          ? this.userRepo.findOne({ where: { id: userId }, relations: ['role'] })
          : Promise.resolve(null),
      ]);

      const totalStudentsCount = sectionCourse?.section?.id && sectionCourse?.academicYear?.id
        ? await this.enrollmentRepo.count({
            where: {
              section: { id: sectionCourse.section.id },
              academicYear: { id: sectionCourse.academicYear.id },
            },
          })
        : 0;

      const submissions = assignments.length
        ? await this.assignmentSubmissionRepo.find({
            where: { assigment: { id: In(assignments.map((item) => item.id)) } },
            relations: ['assigment', 'enrollment', 'enrollment.student', 'enrollment.student.person'],
            order: { submissionDate: 'DESC', attemptNumber: 'DESC' },
          })
        : [];

      const taskComments = assignments.length
        ? await this.taskCommentRepo.find({
            where: { assigment: { id: In(assignments.map((item) => item.id)) } },
            relations: ['assigment', 'user', 'user.person', 'user.role'],
            order: { createdAt: 'ASC' },
          })
        : [];

      const roleName = String(user?.role?.name ?? '').toLowerCase();
      const canViewAllStudents =
        allowedStudentIds === null &&
        (roleName.includes('admin') ||
          roleName.includes('director') ||
          roleName.includes('docente') ||
          roleName.includes('teacher'));

      return assignments.map((assignment) => {
      const comments = taskComments
        .filter((comment) => comment.assigment?.id === assignment.id)
        .map((comment) => ({
          id: comment.id,
          content: comment.content,
          date: comment.createdAt,
          author: {
            id: comment.user?.id,
            name: comment.user?.person
              ? `${comment.user.person.firstName} ${comment.user.person.lastName}`
              : comment.user?.username || 'Usuario',
            avatar: comment.user?.person?.photoUrl || undefined,
            role: comment.user?.role?.name || 'Comentario',
          },
        }));
      const relatedSubmissions = submissions.filter((item) => item.assigment?.id === assignment.id);
      const visibleSubmissions = allowedStudentIds === null
        ? relatedSubmissions
        : relatedSubmissions.filter((item) => allowedStudentIds.includes(item.enrollment?.student?.id));

      const latestByStudent = new Map<string, AssigmentSubmissionEntity>();
      for (const submission of visibleSubmissions) {
        const studentId = submission.enrollment?.student?.id;
        if (!studentId || latestByStudent.has(studentId)) continue;
        latestByStudent.set(studentId, submission);
      }

      const studentSubmissions = Array.from(latestByStudent.values()).map((submission) => ({
        submissionId: submission.id,
        studentId: submission.enrollment?.student?.id,
        studentName: submission.enrollment?.student?.person
          ? `${submission.enrollment.student.person.firstName} ${submission.enrollment.student.person.lastName}`
          : submission.enrollment?.student?.studentCode ?? 'Estudiante',
        status: this.mapSubmissionStatus(submission.status),
        score: submission.status === AssigmentSubmissionStatus.GRADED ? Number(submission.score) : undefined,
        submittedAt: submission.submissionDate,
        feedback: submission.feedback,
      }));

      const gradedCount = studentSubmissions.filter((item) => item.status === 'graded').length;
      const deliveredCount = studentSubmissions.filter((item) => item.status === 'delivered' || item.status === 'late').length;
      const totalTracked = canViewAllStudents
        ? totalStudentsCount
        : (allowedStudentIds?.length ?? studentSubmissions.length);
      const pendingCount = Math.max(totalTracked - studentSubmissions.length, 0);

      if (!canViewAllStudents && allowedStudentIds !== null && allowedStudentIds.length <= 1) {
        const ownSubmission = studentSubmissions[0];
        return {
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          instructions: assignment.instructions,
          date: assignment.dueDate,
          type: assignment.type,
          resourceUrl: assignment.rubricUrl || undefined,
          questionsCount: assignment.questions?.length ?? 0,
          questions: (assignment.questions ?? []).map((question) => ({
            id: question.id,
            prompt: question.prompt,
            type: question.type,
            points: Number(question.points ?? 1),
            required: question.required,
            options: (question.options ?? []).map((option) => ({
              id: option.id,
              label: option.label,
            })),
          })),
          status: ownSubmission?.status ?? 'pending',
          points: assignment.maxScore,
          grade: ownSubmission?.score,
          studentSubmissions,
          comments,
          commentsCount: comments.length,
          submissionSummary: {
            deliveredCount,
            gradedCount,
            pendingCount,
          },
        };
      }

      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        instructions: assignment.instructions,
        date: assignment.dueDate,
        type: assignment.type,
        resourceUrl: assignment.rubricUrl || undefined,
        questionsCount: assignment.questions?.length ?? 0,
        questions: (assignment.questions ?? []).map((question) => ({
          id: question.id,
          prompt: question.prompt,
          type: question.type,
          points: Number(question.points ?? 1),
          required: question.required,
          options: (question.options ?? []).map((option) => ({
            id: option.id,
            label: option.label,
          })),
        })),
        status: gradedCount > 0 && pendingCount === 0 ? 'graded' : deliveredCount > 0 || gradedCount > 0 ? 'delivered' : 'pending',
        points: assignment.maxScore,
        studentSubmissions,
        comments,
        commentsCount: comments.length,
        submissionSummary: {
          deliveredCount,
          gradedCount,
          pendingCount,
        },
      };
      });
    } catch (error) {
      this.logger.error(
        `Error getting tasks for sectionCourse ${sectionCourseId} and user ${userId ?? 'anonymous'}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async createTask(
    userId: string | undefined,
    sectionCourseId: string,
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
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    const access = await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'publish');
    const title = body.title?.trim();

    if (!title) {
      throw new ErrorHandler('El titulo de la tarea es obligatorio', 400);
    }

    if (!body.dueDate) {
      throw new ErrorHandler('La fecha limite es obligatoria', 400);
    }

    const dueDate = new Date(body.dueDate);
    if (Number.isNaN(dueDate.getTime())) {
      throw new ErrorHandler('La fecha limite no es valida', 400);
    }

    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: resolvedSectionCourseId },
      relations: ['teacher', 'teacher.person'],
    });

    const teacher =
      sectionCourse?.teacher ??
      (access.user.person?.id
        ? await this.teacherRepo.findOne({ where: { person: { id: access.user.person.id } } })
        : null);

    if (!teacher?.id) {
      throw new ErrorHandler('No se encontro el docente responsable para esta tarea', 400);
    }

    const assignment = this.assignmentRepo.create({
      title,
      description: body.description?.trim() || '',
      instructions: body.instructions?.trim() || body.description?.trim() || '',
      maxScore: Number(body.maxScore ?? 20),
      assignedDate: new Date(),
      dueDate,
      lateSubmissionAllowed: body.lateSubmissionAllowed ?? true,
      latePenaltyPercentage: 0,
      type: Object.values(AssigmentType).includes(body.type as AssigmentType)
        ? (body.type as AssigmentType)
        : AssigmentType.HOMEWORK,
      maxFileSizeMB: 10,
      allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip'],
      maxAttempts: Math.max(1, Number(body.maxAttempts ?? 1)),
      groupAssignment: false,
      rubricUrl: body.resourceUrl?.trim() || '',
      status: AssigmentStatus.PUBLISHED,
      sectionCourse: { id: resolvedSectionCourseId },
      teacher: { id: teacher.id },
    });

    if ((body.type as AssigmentType) === AssigmentType.QUIZ) {
      const activePeriod = await this.periodRepo.findOne({
        where: { academicYear: { id: sectionCourse?.academicYear?.id } as any },
        order: { startDate: 'ASC' },
      });

      if (!activePeriod?.id) {
        throw new ErrorHandler('No se encontró un periodo académico para vincular el quiz', 400);
      }

      const assessment = this.assessmentRepo.create({
        name: title,
        description: body.description?.trim() || 'Evaluación generada desde quiz del aula virtual',
        assessmentDate: dueDate as any,
        weightPercentage: 0,
        maxScore: Number(body.maxScore ?? 20),
        type: AssessmentType.FORMATIVE,
        status: AssessmentStatus.PENDING,
        period: { id: activePeriod.id },
        sectionCourse: { id: resolvedSectionCourseId },
      });

      const savedAssessment = await this.assessmentRepo.save(assessment);
      assignment.assessment = { id: savedAssessment.id } as any;
    }

    const saved = await this.assignmentRepo.save(assignment);

    if (body.questions?.length) {
      for (const [questionIndex, questionPayload] of body.questions.entries()) {
        const question = this.assignmentQuestionRepo.create({
          prompt: questionPayload.prompt.trim(),
          type: Object.values(AssigmentQuestionType).includes(questionPayload.type as AssigmentQuestionType)
            ? (questionPayload.type as AssigmentQuestionType)
            : AssigmentQuestionType.SHORT_ANSWER,
          orderIndex: questionIndex + 1,
          points: Number(questionPayload.points ?? 1),
          required: questionPayload.required ?? true,
          assigment: { id: saved.id },
        });

        const savedQuestion = await this.assignmentQuestionRepo.save(question);

        if (questionPayload.type !== 'short_answer' && questionPayload.options?.length) {
          const options = questionPayload.options
            .filter((option) => option.label?.trim())
            .map((option, optionIndex) =>
              this.assignmentQuestionOptionRepo.create({
                label: option.label.trim(),
                isCorrect: option.isCorrect ?? false,
                orderIndex: optionIndex + 1,
                question: { id: savedQuestion.id },
              }),
            );

          if (options.length) {
            await this.assignmentQuestionOptionRepo.save(options);
          }
        }
      }
    }

    this.eventEmitter.emit('assignments.published', {
      id: saved.id,
      title: saved.title,
      description: saved.description ?? null,
      sectionCourseId: resolvedSectionCourseId,
      status: saved.status,
    });

    return {
      id: saved.id,
      title: saved.title,
      description: saved.description,
      instructions: saved.instructions,
      date: saved.dueDate,
      type: saved.type,
      resourceUrl: saved.rubricUrl || undefined,
      questionsCount: body.questions?.length ?? 0,
      status: 'pending',
      points: saved.maxScore,
      studentSubmissions: [],
      submissionSummary: {
        deliveredCount: 0,
        gradedCount: 0,
        pendingCount: 0,
      },
    };
  }

  async getTaskEditor(userId: string | undefined, sectionCourseId: string, assignmentId: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'publish');

    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId, sectionCourse: { id: resolvedSectionCourseId } },
      relations: ['questions', 'questions.options'],
      order: {
        questions: {
          orderIndex: 'ASC',
          options: {
            orderIndex: 'ASC',
          },
        },
      } as any,
    });

    if (!assignment) {
      throw new ErrorHandler('Tarea no encontrada para edición', 404);
    }

    return {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      instructions: assignment.instructions,
      dueDate: assignment.dueDate,
      maxScore: Number(assignment.maxScore ?? 20),
      maxAttempts: Number(assignment.maxAttempts ?? 1),
      lateSubmissionAllowed: assignment.lateSubmissionAllowed,
      type: assignment.type,
      resourceUrl: assignment.rubricUrl || '',
      questions: (assignment.questions ?? []).map((question) => ({
        id: question.id,
        prompt: question.prompt,
        type: question.type,
        points: Number(question.points ?? 1),
        required: question.required,
        options: (question.options ?? []).map((option) => ({
          id: option.id,
          label: option.label,
          isCorrect: option.isCorrect,
        })),
      })),
    };
  }

  async updateTask(
    userId: string | undefined,
    sectionCourseId: string,
    assignmentId: string,
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
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'publish');

    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId, sectionCourse: { id: resolvedSectionCourseId } },
      relations: ['questions', 'questions.options', 'assessment', 'sectionCourse', 'sectionCourse.academicYear'],
    });

    if (!assignment) {
      throw new ErrorHandler('Tarea no encontrada para actualizar', 404);
    }

    const dueDate = new Date(body.dueDate);
    if (Number.isNaN(dueDate.getTime())) {
      throw new ErrorHandler('La fecha limite no es valida', 400);
    }

    const nextType = Object.values(AssigmentType).includes(body.type as AssigmentType)
      ? (body.type as AssigmentType)
      : assignment.type;

    assignment.title = body.title?.trim() || assignment.title;
    assignment.description = body.description?.trim() || '';
    assignment.instructions = body.instructions?.trim() || body.description?.trim() || '';
    assignment.dueDate = dueDate;
    assignment.maxScore = Number(body.maxScore ?? assignment.maxScore ?? 20);
    assignment.maxAttempts = Math.max(1, Number(body.maxAttempts ?? assignment.maxAttempts ?? 1));
    assignment.lateSubmissionAllowed = body.lateSubmissionAllowed ?? assignment.lateSubmissionAllowed;
    assignment.type = nextType;
    assignment.rubricUrl = body.resourceUrl?.trim() || '';

    if (nextType === AssigmentType.QUIZ) {
      const activePeriod = await this.periodRepo.findOne({
        where: { academicYear: { id: assignment.sectionCourse?.academicYear?.id } as any },
        order: { startDate: 'ASC' },
      });

      if (!activePeriod?.id) {
        throw new ErrorHandler('No se encontró un periodo académico para vincular el quiz', 400);
      }

      if (assignment.assessment?.id) {
        const currentAssessment = await this.assessmentRepo.findOne({ where: { id: assignment.assessment.id } });
        if (currentAssessment) {
          currentAssessment.name = assignment.title;
          currentAssessment.description = assignment.description || 'Evaluación generada desde quiz del aula virtual';
          currentAssessment.assessmentDate = dueDate as any;
          currentAssessment.maxScore = assignment.maxScore;
          currentAssessment.period = { id: activePeriod.id } as any;
          await this.assessmentRepo.save(currentAssessment);
        }
      } else {
        const assessment = this.assessmentRepo.create({
          name: assignment.title,
          description: assignment.description || 'Evaluación generada desde quiz del aula virtual',
          assessmentDate: dueDate as any,
          weightPercentage: 0,
          maxScore: assignment.maxScore,
          type: AssessmentType.FORMATIVE,
          status: AssessmentStatus.PENDING,
          period: { id: activePeriod.id },
          sectionCourse: { id: resolvedSectionCourseId },
        });
        const savedAssessment = await this.assessmentRepo.save(assessment);
        assignment.assessment = { id: savedAssessment.id } as any;
      }
    } else {
      assignment.assessment = null;
    }

    const saved = await this.assignmentRepo.save(assignment);

    if (assignment.questions?.length) {
      const optionIds = assignment.questions.flatMap((question) => (question.options ?? []).map((option) => option.id));
      if (optionIds.length) {
        await this.assignmentQuestionOptionRepo.delete(optionIds);
      }
      await this.assignmentQuestionRepo.delete(assignment.questions.map((question) => question.id));
    }

    if (nextType === AssigmentType.QUIZ && body.questions?.length) {
      for (const [questionIndex, questionPayload] of body.questions.entries()) {
        const question = this.assignmentQuestionRepo.create({
          prompt: questionPayload.prompt.trim(),
          type: Object.values(AssigmentQuestionType).includes(questionPayload.type as AssigmentQuestionType)
            ? (questionPayload.type as AssigmentQuestionType)
            : AssigmentQuestionType.SHORT_ANSWER,
          orderIndex: questionIndex + 1,
          points: Number(questionPayload.points ?? 1),
          required: questionPayload.required ?? true,
          assigment: { id: saved.id },
        });

        const savedQuestion = await this.assignmentQuestionRepo.save(question);

        if (questionPayload.type !== 'short_answer' && questionPayload.options?.length) {
          const options = questionPayload.options
            .filter((option) => option.label?.trim())
            .map((option, optionIndex) =>
              this.assignmentQuestionOptionRepo.create({
                label: option.label.trim(),
                isCorrect: option.isCorrect ?? false,
                orderIndex: optionIndex + 1,
                question: { id: savedQuestion.id },
              }),
            );

          if (options.length) {
            await this.assignmentQuestionOptionRepo.save(options);
          }
        }
      }
    }

    return this.getTaskEditor(userId, resolvedSectionCourseId, saved.id);
  }

  async deleteTask(userId: string | undefined, sectionCourseId: string, assignmentId: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'publish');

    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId, sectionCourse: { id: resolvedSectionCourseId } },
      relations: ['assessment'],
    });

    if (!assignment) {
      throw new ErrorHandler('Tarea no encontrada para eliminar', 404);
    }

    await this.assignmentRepo.softRemove(assignment);

    if (assignment.assessment?.id) {
      const assessment = await this.assessmentRepo.findOne({ where: { id: assignment.assessment.id } });
      if (assessment) {
        await this.assessmentRepo.softRemove(assessment);
      }
    }

    return { id: assignmentId, deleted: true };
  }

  async createTaskComment(userId: string, sectionCourseId: string, assignmentId: string, content: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    const access = await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'comment');
    const trimmed = content?.trim();
    if (!trimmed) {
      throw new ErrorHandler('El comentario es obligatorio', 400);
    }
    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId, sectionCourse: { id: resolvedSectionCourseId } },
    });
    if (!assignment) {
      throw new ErrorHandler('Tarea no encontrada', 404);
    }
    const comment = this.taskCommentRepo.create({
      content: trimmed,
      assigment: { id: assignment.id },
      user: { id: access.user.id },
    });
    await this.taskCommentRepo.save(comment);
    return this.getTasks(resolvedSectionCourseId, userId).then((items) => items.find((item) => item.id === assignmentId));
  }

  async updateTaskComment(userId: string, sectionCourseId: string, assignmentId: string, commentId: string, content: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    const access = await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'comment');
    const trimmed = content?.trim();
    if (!trimmed) {
      throw new ErrorHandler('El comentario es obligatorio', 400);
    }
    const comment = await this.taskCommentRepo.findOne({
      where: { id: commentId, assigment: { id: assignmentId, sectionCourse: { id: resolvedSectionCourseId } } as any },
      relations: ['user'],
    });
    if (!comment) throw new ErrorHandler('Comentario no encontrado', 404);
    if (!this.canManageTaskComment(access.user, comment)) throw new ErrorHandler('No puedes editar este comentario', 403);
    comment.content = trimmed;
    await this.taskCommentRepo.save(comment);
    return this.getTasks(resolvedSectionCourseId, userId).then((items) => items.find((item) => item.id === assignmentId));
  }

  async deleteTaskComment(userId: string, sectionCourseId: string, assignmentId: string, commentId: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    const access = await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'comment');
    const comment = await this.taskCommentRepo.findOne({
      where: { id: commentId, assigment: { id: assignmentId, sectionCourse: { id: resolvedSectionCourseId } } as any },
      relations: ['user'],
    });
    if (!comment) throw new ErrorHandler('Comentario no encontrado', 404);
    if (!this.canManageTaskComment(access.user, comment)) throw new ErrorHandler('No puedes eliminar este comentario', 403);
    await this.taskCommentRepo.softRemove(comment);
    return this.getTasks(resolvedSectionCourseId, userId).then((items) => items.find((item) => item.id === assignmentId));
  }

  async submitTask(
    userId: string | undefined,
    sectionCourseId: string,
    assignmentId: string,
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
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'submit');

    const enrollment = await this.getCurrentStudentEnrollment(userId, resolvedSectionCourseId);
    if (!enrollment) {
      throw new ErrorHandler('No se encontro una matricula activa para este curso', 404);
    }

    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId, sectionCourse: { id: resolvedSectionCourseId } },
      relations: ['questions', 'questions.options', 'assessment'],
    });

    if (!assignment) {
      throw new ErrorHandler('Tarea no encontrada para este curso', 404);
    }

    const latestSubmission = await this.assignmentSubmissionRepo.findOne({
      where: {
        assigment: { id: assignmentId },
        enrollment: { id: enrollment.id },
      },
      order: { submissionDate: 'DESC', attemptNumber: 'DESC' },
    });

    const now = new Date();
    const isLate = assignment.dueDate ? new Date(assignment.dueDate).getTime() < now.getTime() : false;
    const nextAttempt = (latestSubmission?.attemptNumber ?? 0) + 1;
    const quizResult =
      assignment.type === AssigmentType.QUIZ
        ? this.gradeQuizSubmission(assignment, body.answers ?? [])
        : null;
    const nextStatus =
      assignment.type === AssigmentType.QUIZ && quizResult?.autoGraded
        ? AssigmentSubmissionStatus.GRADED
        : isLate
        ? AssigmentSubmissionStatus.LATE
        : AssigmentSubmissionStatus.PENDING;

    const entity = latestSubmission
      ? this.assignmentSubmissionRepo.merge(latestSubmission, {
          submissionText: body.submissionText ?? latestSubmission.submissionText ?? '',
          fileUrl: body.fileUrl ?? latestSubmission.fileUrl ?? '',
          fileName: body.fileName ?? latestSubmission.fileName ?? '',
          linkUrl: body.linkUrl ?? latestSubmission.linkUrl ?? '',
          responseData: quizResult?.normalizedAnswers ?? latestSubmission.responseData ?? null,
          submissionDate: now,
          attemptNumber: nextAttempt,
          score: quizResult?.autoGraded ? quizResult.score : latestSubmission.score ?? 0,
          status: nextStatus,
          gradedAt: quizResult?.autoGraded ? (now as any) : latestSubmission.gradedAt,
          feedbackDate: quizResult?.autoGraded ? (now as any) : latestSubmission.feedbackDate,
          feedback:
            quizResult?.autoGraded
              ? 'Calificación automática del quiz'
              : latestSubmission.feedback ?? '',
        })
      : this.assignmentSubmissionRepo.create({
          attemptNumber: 1,
          submissionDate: now,
          submissionText: body.submissionText ?? '',
          fileUrl: body.fileUrl ?? '',
          fileName: body.fileName ?? '',
          linkUrl: body.linkUrl ?? '',
          responseData: quizResult?.normalizedAnswers ?? null,
          score: quizResult?.autoGraded ? quizResult.score : 0,
          feedback: quizResult?.autoGraded ? 'Calificación automática del quiz' : '',
          feedbackDate: null as any,
          feedbackFileUrl: '',
          gradedBy: '',
          gradedAt: quizResult?.autoGraded ? (now as any) : (null as any),
          status: nextStatus,
          assigment: { id: assignmentId },
          enrollment: { id: enrollment.id },
        });

    const saved = await this.assignmentSubmissionRepo.save(entity);
    if (quizResult?.autoGraded) {
      await this.syncAssessmentScore(assignment.assessment?.id, enrollment.id, quizResult.score, 'Quiz autoevaluado');
    }
    return {
      id: saved.id,
      status: this.mapSubmissionStatus(saved.status),
      submittedAt: saved.submissionDate,
      score: saved.score,
    };
  }

  async reviewTaskSubmission(
    userId: string | undefined,
    sectionCourseId: string,
    assignmentId: string,
    submissionId: string,
    body: {
      score: number;
      feedback?: string;
    },
  ) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'review');

    const submission = await this.assignmentSubmissionRepo.findOne({
      where: {
        id: submissionId,
        assigment: { id: assignmentId, sectionCourse: { id: resolvedSectionCourseId } },
      },
      relations: ['assigment', 'assigment.assessment', 'enrollment'],
    });

    if (!submission) {
      throw new ErrorHandler('Entrega no encontrada', 404);
    }

    submission.score = Number(body.score ?? 0);
    submission.feedback = body.feedback ?? '';
    submission.feedbackDate = new Date() as any;
    submission.gradedAt = new Date() as any;
    submission.gradedBy = userId ?? '';
    submission.status = AssigmentSubmissionStatus.GRADED;

    const saved = await this.assignmentSubmissionRepo.save(submission);
    await this.syncAssessmentScore(submission.assigment?.assessment?.id, submission.enrollment?.id, Number(saved.score ?? 0), body.feedback);
    return {
      id: saved.id,
      score: saved.score,
      feedback: saved.feedback,
      status: this.mapSubmissionStatus(saved.status),
    };
  }

  async getGrades(sectionCourseId: string, userId?: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    await this.ensureClassroomAccess(userId, resolvedSectionCourseId, 'view');
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: resolvedSectionCourseId },
      relations: ['academicYear', 'academicYear.gradeScales'],
    });
    const gradeScales = (sectionCourse?.academicYear?.gradeScales ?? []).map((scale) => ({
      label: scale.label,
      minScore: Number(scale.minScore),
      maxScore: Number(scale.maxScore),
    }));
    const assessments = await this.assessmentRepo.find({
      where: { sectionCourse: { id: resolvedSectionCourseId } },
      relations: ['period', 'competency'],
      order: { assessmentDate: 'ASC' },
    });

    const scores = await this.assessmentScoreRepo.find({
      where: { assessment: { sectionCourse: { id: resolvedSectionCourseId } } },
      relations: ['assessment', 'enrollment', 'enrollment.student', 'enrollment.student.person'],
      order: { registerAt: 'DESC' },
    });

    const allowedStudentIds = await this.getAllowedStudentIds(userId);
    const visibleScores = allowedStudentIds === null
      ? scores
      : scores.filter((score) => allowedStudentIds.includes(score.enrollment?.student?.id));

    const rows = assessments.map((assessment) => {
      const relatedScores = visibleScores.filter((score) => score.assessment?.id === assessment.id);
      const average = relatedScores.length
        ? relatedScores.reduce((acc, score) => acc + Number(score.score), 0) / relatedScores.length
        : 0;

      return {
        id: assessment.id,
        name: assessment.name,
        description: assessment.description,
        date: assessment.assessmentDate,
        total: assessment.maxScore,
        type: assessment.type,
        status: assessment.status,
        weightPercentage: assessment.weightPercentage,
        period: assessment.period
          ? {
              id: assessment.period.id,
              name: assessment.period.name,
              periodNumber: assessment.period.periodNumber,
            }
          : undefined,
        competency: assessment.competency
          ? {
              id: assessment.competency.id,
              code: assessment.competency.code,
              name: assessment.competency.name,
            }
          : undefined,
        average: Number(average.toFixed(2)),
        averageLabel: this.gradeScaleLabel(Number(average.toFixed(2)), gradeScales),
        studentsCount: relatedScores.length,
        scores: relatedScores.map((score) => ({
          id: score.id,
          studentId: score.enrollment?.student?.id,
          studentName: score.enrollment?.student?.person
            ? `${score.enrollment.student.person.firstName} ${score.enrollment.student.person.lastName}`
            : score.enrollment?.student?.studentCode || 'Estudiante',
          studentCode: score.enrollment?.student?.studentCode || '',
          studentPhotoUrl: score.enrollment?.student?.person?.photoUrl || '',
          score: Number(score.score),
          gradeLabel: this.gradeScaleLabel(Number(score.score), gradeScales),
          observation: score.observation,
        })),
      };
    });

    const overallAverage = this.weightedAverage(
      rows.map((row) => ({
        value: row.average,
        weight: Number(row.weightPercentage || 0),
      })),
    );

    return {
      data: rows,
      summary: {
        assessments: rows.length,
        scores: visibleScores.length,
        average: Number(overallAverage.toFixed(2)),
        averageLabel: this.gradeScaleLabel(Number(overallAverage.toFixed(2)), gradeScales),
      },
    };
  }

  private weightedAverage(items: Array<{ value: number; weight: number }>) {
    if (!items.length) return 0;
    const totalWeight = items.reduce((acc, item) => acc + Math.max(Number(item.weight || 0), 0), 0);
    if (totalWeight <= 0) {
      return items.reduce((acc, item) => acc + Number(item.value || 0), 0) / items.length;
    }
    return items.reduce((acc, item) => acc + Number(item.value || 0) * Math.max(Number(item.weight || 0), 0), 0) / totalWeight;
  }

  private async getAllowedStudentIds(userId?: string): Promise<string[] | null> {
    if (!userId) return null;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['person', 'role'],
    });

    const roleName = String(user?.role?.name ?? '').toLowerCase();
    const personId = user?.person?.id;

    if (!user || !personId) return null;

    if (
      roleName.includes('admin') ||
      roleName.includes('director') ||
      roleName.includes('docente') ||
      roleName.includes('teacher')
    ) {
      return null;
    }

    if (roleName.includes('alumno') || roleName.includes('student')) {
      const student = await this.studentRepo.findOne({
        where: { person: { id: personId } },
      });
      return student ? [student.id] : [];
    }

    if (roleName.includes('apoderado') || roleName.includes('guardian') || roleName.includes('tutor')) {
      const guardian = await this.guardianRepo.findOne({
        where: { person: { id: personId } },
      });

      if (!guardian) return [];

      const links = await this.studentGuardianRepo.find({
        where: { guardian: { id: guardian.id } },
        relations: ['student'],
      });

      return links.map((link) => link.student?.id).filter(Boolean);
    }

    return [];
  }

  private async getCurrentStudentEnrollment(userId: string | undefined, sectionCourseId: string) {
    if (!userId) return null;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['person'],
    });

    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: resolvedSectionCourseId },
      relations: ['section', 'academicYear'],
    });

    if (!user?.person?.id || !sectionCourse?.section?.id || !sectionCourse?.academicYear?.id) {
      return null;
    }

    const student = await this.studentRepo.findOne({
      where: { person: { id: user.person.id } },
    });

    if (!student) {
      return null;
    }

    return this.enrollmentRepo.findOne({
      where: {
        student: { id: student.id },
        section: { id: sectionCourse.section.id },
        academicYear: { id: sectionCourse.academicYear.id },
      },
      relations: ['student', 'student.person'],
    });
  }

  private mapSubmissionStatus(status: AssigmentSubmissionStatus) {
    if (status === AssigmentSubmissionStatus.GRADED) return 'graded';
    if (status === AssigmentSubmissionStatus.LATE) return 'late';
    return 'delivered';
  }

  private normalizeQuizAnswers(
    answers: Array<{
      questionId: string;
      selectedOptionIds?: string[];
      answerText?: string;
    }> = [],
  ) {
    return answers.map((answer) => ({
      questionId: answer.questionId,
      selectedOptionIds: Array.isArray(answer.selectedOptionIds) ? answer.selectedOptionIds : [],
      answerText: answer.answerText?.trim() || '',
    }));
  }

  private gradeQuizSubmission(
    assignment: AssigmentEntity,
    answers: Array<{
      questionId: string;
      selectedOptionIds?: string[];
      answerText?: string;
    }>,
  ) {
    const normalizedAnswers = this.normalizeQuizAnswers(answers);
    let earnedPoints = 0;
    let autoGraded = true;

    for (const question of assignment.questions ?? []) {
      const answer = normalizedAnswers.find((item) => item.questionId === question.id);
      if (!answer) continue;

      if (question.type === AssigmentQuestionType.SHORT_ANSWER) {
        autoGraded = false;
        continue;
      }

      const selected = [...(answer.selectedOptionIds ?? [])].sort();
      const correct = [...(question.options ?? []).filter((option) => option.isCorrect).map((option) => option.id)].sort();
      if (selected.length === correct.length && selected.every((value, index) => value === correct[index])) {
        earnedPoints += Number(question.points ?? 1);
      }
    }

    const maxScore = Number(assignment.maxScore || 0);
    const maxQuestionPoints = (assignment.questions ?? []).reduce((acc, question) => acc + Number(question.points ?? 1), 0);
    const rawScore = maxQuestionPoints > 0 ? (earnedPoints / maxQuestionPoints) * maxScore : 0;

    return {
      normalizedAnswers,
      autoGraded,
      score: Math.round(rawScore * 100) / 100,
    };
  }

  private async syncAssessmentScore(assessmentId: string | undefined, enrollmentId: string, score: number, observation?: string) {
    if (!assessmentId) return;

    const existing = await this.assessmentScoreRepo.findOne({
      where: {
        assessment: { id: assessmentId },
        enrollment: { id: enrollmentId },
      },
    });

    if (existing) {
      existing.score = score as any;
      existing.observation = observation ?? '';
      existing.registerAt = new Date() as any;
      await this.assessmentScoreRepo.save(existing);
      await this.assessmentConsolidationService.syncForAssessment(assessmentId);
      return existing;
    }

    const created = this.assessmentScoreRepo.create({
      score: score as any,
      observation: observation ?? '',
      registerAt: new Date() as any,
      enrollment: { id: enrollmentId },
      assessment: { id: assessmentId },
    });

    const saved = await this.assessmentScoreRepo.save(created);
    await this.assessmentConsolidationService.syncForAssessment(assessmentId);
    return saved;
  }

  private async ensureChatRoom(sectionCourseId: string) {
    const resolvedSectionCourseId = await this.resolveSectionCourseId(sectionCourseId);
    let room = await this.roomRepo.findOne({
      where: { sectionCourse: { id: resolvedSectionCourseId } },
    });

    if (!room) {
      room = this.roomRepo.create({
        name: 'Class Chat',
        type: ChatRoomType.GROUP,
        sectionCourse: { id: resolvedSectionCourseId },
      });
      room = await this.roomRepo.save(room);
    }

    return room;
  }

  private mapChatMessage(message: ChatMessageEntity | null) {
    return {
      id: message?.id,
      senderId: message?.user?.id,
      senderName: this.userDisplay(message?.user),
      senderAvatar: message?.user?.person?.photoUrl || undefined,
      content: message?.content,
      isMe: false,
      timestamp: message?.createdAt ? new Date(message.createdAt).toISOString() : '',
    };
  }

  private mapPostToFeedItem(post: ClassroomPostEntity) {
    return {
      id: post.id,
      type: 'post',
      title: '',
      content: post.content,
      date: post.createdAt || new Date(),
      attachmentUrl: post.attachmentUrl,
      metadata: {
        attachments: post.attachmentUrl
          ? [{ url: post.attachmentUrl, name: this.inferAttachmentName(post.attachmentUrl) }]
          : [],
      },
      author: {
        id: post.user?.id,
        name: this.userDisplay(post.user),
        avatar: post.user?.person?.photoUrl || undefined,
        role: post.user?.role?.name || 'Publicacion',
      },
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        date: comment.createdAt || new Date(),
        author: {
          id: comment.user?.id,
          name: comment.user?.person ? `${comment.user.person.firstName} ${comment.user.person.lastName}` : comment.user?.username,
          avatar: comment.user?.person?.photoUrl || undefined,
          role: comment.user?.role?.name || 'Comentario',
        },
      })),
      commentsCount: post.comments.length,
    };
  }
}

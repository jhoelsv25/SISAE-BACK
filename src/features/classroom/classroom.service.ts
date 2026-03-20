import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { AssigmentEntity } from '../assigments/entities/assigment.entity';
import { AssigmentSubmissionEntity } from '../assigment_submissions/entities/assigment_submission.entity';
import { AssigmentSubmissionStatus } from '../assigment_submissions/enums/assigment_submission.enum';
import { AssessmentScoreEntity } from '../assessment_scores/entities/assessment_score.entity';
import { AssessmentEntity } from '../assessments/entities/assessment.entity';
import { ChatMessageEntity } from '../chat_messages/entities/chat_message.entity';
import { ChatMessageType } from '../chat_messages/enums/chat_message.enum';
import { ChatRoomType } from '../chat_rooms/enums/chat_room.enum';
import { ChatRoomEntity } from '../chat_rooms/entities/chat_room.entity';
import { EnrollmentEntity } from '../enrollments/entities/enrollment.entity';
import { GuardianEntity } from '../guardians/entities/guardian.entity';
import { LearningMaterialEntity } from '../learning_materials/entities/learning_material.entity';
import { SectionCourseEntity } from '../section-course/entities/section-course.entity';
import { StudentGuardianEntity } from '../student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '../students/entities/student.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ClassroomPostEntity } from './entities/classroom-post.entity';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomPostEntity)
    private readonly postRepo: Repository<ClassroomPostEntity>,
    @InjectRepository(LearningMaterialEntity)
    private readonly materialRepo: Repository<LearningMaterialEntity>,
    @InjectRepository(AssigmentEntity)
    private readonly assignmentRepo: Repository<AssigmentEntity>,
    @InjectRepository(AssigmentSubmissionEntity)
    private readonly assignmentSubmissionRepo: Repository<AssigmentSubmissionEntity>,
    @InjectRepository(AssessmentEntity)
    private readonly assessmentRepo: Repository<AssessmentEntity>,
    @InjectRepository(AssessmentScoreEntity)
    private readonly assessmentScoreRepo: Repository<AssessmentScoreEntity>,
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
    @InjectRepository(SectionCourseEntity)
    private readonly sectionCourseRepo: Repository<SectionCourseEntity>,
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

  async getFeed(sectionCourseId: string) {
    try {
      const posts = await this.postRepo.find({
        where: { sectionCourse: { id: sectionCourseId } },
        relations: ['user', 'user.person', 'comments', 'comments.user', 'comments.user.person'],
        order: { id: 'DESC' }, // Assuming BaseEntity has id and we use it for order if createdAt is tricky
      });

      const materials = await this.materialRepo.find({
        where: { sectionCourse: { id: sectionCourseId } },
        relations: ['teacher', 'teacher.person'],
        order: { id: 'DESC' },
      });

      const assignments = await this.assignmentRepo.find({
        where: { sectionCourse: { id: sectionCourseId } },
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
            name: this.userDisplay(p.user),
            avatar: p.user?.person?.photoUrl || undefined,
            role: p.user?.role?.name || 'Publicacion',
          },
          comments: p.comments.map(c => ({
            id: c.id,
            content: c.content,
            date: (c as any).createdAt || new Date(),
            author: c.user?.person ? `${c.user.person.firstName} ${c.user.person.lastName}` : c.user?.username
          })),
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
      throw new ErrorHandler('Error al obtener feed: ' + error.message, 500);
    }
  }

  async publishPost(userId: string, sectionCourseId: string, content: string, attachmentUrl?: string) {
    try {
      const canPublish = await this.canPublishInClassroom(userId);
      if (!canPublish) {
        throw new ErrorHandler('No tienes permisos para publicar en el aula', 403);
      }

      const post = this.postRepo.create({
        content,
        attachmentUrl,
        user: { id: userId },
        sectionCourse: { id: sectionCourseId }
      });
      return await this.postRepo.save(post);
    } catch (error) {
      throw new ErrorHandler('Error al publicar post: ' + error.message, 500);
    }
  }

  async getFeedItemByPostId(postId: string) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['user', 'user.person', 'comments', 'comments.user', 'comments.user.person'],
    });

    if (!post) {
      throw new ErrorHandler('Publicacion no encontrada', 404);
    }

    return this.mapPostToFeedItem(post);
  }

  async getChatHistory(sectionCourseId: string) {
    try {
      const room = await this.roomRepo.findOne({ where: { sectionCourse: { id: sectionCourseId } } });
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
    const message = await this.saveMessage(userId, sectionCourseId, content);
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

  async getTeachers(sectionCourseId: string) {
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: sectionCourseId },
      relations: ['teacher', 'teacher.person'],
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
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: sectionCourseId },
      relations: ['section', 'academicYear'],
    });

    if (!sectionCourse?.section?.id) {
      return { teachers: [], students: [] };
    }

    const [teachers, allowedStudentIds, enrollments] = await Promise.all([
      this.getTeachers(sectionCourseId),
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
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: sectionCourseId },
      relations: ['section', 'academicYear'],
    });

    const assignments = await this.assignmentRepo.find({
      where: { sectionCourse: { id: sectionCourseId } },
      order: { dueDate: 'ASC' },
    });

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

    const roleName = String(user?.role?.name ?? '').toLowerCase();
    const canViewAllStudents =
      allowedStudentIds === null &&
      (roleName.includes('admin') ||
        roleName.includes('director') ||
        roleName.includes('docente') ||
        roleName.includes('teacher'));

    return assignments.map((assignment) => {
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
          date: assignment.dueDate,
          status: ownSubmission?.status ?? 'pending',
          points: assignment.maxScore,
          grade: ownSubmission?.score,
          studentSubmissions,
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
        date: assignment.dueDate,
        status: gradedCount > 0 && pendingCount === 0 ? 'graded' : deliveredCount > 0 || gradedCount > 0 ? 'delivered' : 'pending',
        points: assignment.maxScore,
        studentSubmissions,
        submissionSummary: {
          deliveredCount,
          gradedCount,
          pendingCount,
        },
      };
    });
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
    },
  ) {
    const canSubmit = await this.canSubmitTask(userId);
    if (!canSubmit) {
      throw new ErrorHandler('No tienes permisos para entregar tareas', 403);
    }

    const enrollment = await this.getCurrentStudentEnrollment(userId, sectionCourseId);
    if (!enrollment) {
      throw new ErrorHandler('No se encontro una matricula activa para este curso', 404);
    }

    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId, sectionCourse: { id: sectionCourseId } },
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

    const entity = latestSubmission
      ? this.assignmentSubmissionRepo.merge(latestSubmission, {
          submissionText: body.submissionText ?? latestSubmission.submissionText ?? '',
          fileUrl: body.fileUrl ?? latestSubmission.fileUrl ?? '',
          fileName: body.fileName ?? latestSubmission.fileName ?? '',
          linkUrl: body.linkUrl ?? latestSubmission.linkUrl ?? '',
          submissionDate: now,
          attemptNumber: nextAttempt,
          status: isLate ? AssigmentSubmissionStatus.LATE : AssigmentSubmissionStatus.PENDING,
        })
      : this.assignmentSubmissionRepo.create({
          attemptNumber: 1,
          submissionDate: now,
          submissionText: body.submissionText ?? '',
          fileUrl: body.fileUrl ?? '',
          fileName: body.fileName ?? '',
          linkUrl: body.linkUrl ?? '',
          score: 0,
          feedback: '',
          feedbackDate: null as any,
          feedbackFileUrl: '',
          gradedBy: '',
          gradedAt: null as any,
          status: isLate ? AssigmentSubmissionStatus.LATE : AssigmentSubmissionStatus.PENDING,
          assigment: { id: assignmentId },
          enrollment: { id: enrollment.id },
        });

    const saved = await this.assignmentSubmissionRepo.save(entity);
    return {
      id: saved.id,
      status: this.mapSubmissionStatus(saved.status),
      submittedAt: saved.submissionDate,
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
    const canReview = await this.canReviewTask(userId);
    if (!canReview) {
      throw new ErrorHandler('No tienes permisos para calificar entregas', 403);
    }

    const submission = await this.assignmentSubmissionRepo.findOne({
      where: {
        id: submissionId,
        assigment: { id: assignmentId, sectionCourse: { id: sectionCourseId } },
      },
      relations: ['assigment'],
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
    return {
      id: saved.id,
      score: saved.score,
      feedback: saved.feedback,
      status: this.mapSubmissionStatus(saved.status),
    };
  }

  async getGrades(sectionCourseId: string, userId?: string) {
    const assessments = await this.assessmentRepo.find({
      where: { sectionCourse: { id: sectionCourseId } },
      order: { assessmentDate: 'ASC' },
    });

    const scores = await this.assessmentScoreRepo.find({
      where: { assessment: { sectionCourse: { id: sectionCourseId } } },
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
        average: Number(average.toFixed(2)),
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
          observation: score.observation,
        })),
      };
    });

    const overallAverage = rows.length
      ? rows.reduce((acc, row) => acc + row.average, 0) / rows.length
      : 0;

    return {
      data: rows,
      summary: {
        assessments: rows.length,
        scores: visibleScores.length,
        average: Number(overallAverage.toFixed(2)),
      },
    };
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

  private async canPublishInClassroom(userId?: string) {
    if (!userId) return false;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    const roleName = String(user?.role?.name ?? '').toLowerCase();

    return (
      roleName.includes('admin') ||
      roleName.includes('director') ||
      roleName.includes('docente') ||
      roleName.includes('teacher')
    );
  }

  private async canSubmitTask(userId?: string) {
    if (!userId) return false;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    const roleName = String(user?.role?.name ?? '').toLowerCase();
    return roleName.includes('alumno') || roleName.includes('student');
  }

  private async canReviewTask(userId?: string) {
    if (!userId) return false;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    const roleName = String(user?.role?.name ?? '').toLowerCase();
    return (
      roleName.includes('admin') ||
      roleName.includes('director') ||
      roleName.includes('docente') ||
      roleName.includes('teacher')
    );
  }

  private async getCurrentStudentEnrollment(userId: string | undefined, sectionCourseId: string) {
    if (!userId) return null;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['person'],
    });

    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: sectionCourseId },
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

  private async ensureChatRoom(sectionCourseId: string) {
    let room = await this.roomRepo.findOne({
      where: { sectionCourse: { id: sectionCourseId } },
    });

    if (!room) {
      room = this.roomRepo.create({
        name: 'Class Chat',
        type: ChatRoomType.GROUP,
        sectionCourse: { id: sectionCourseId },
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
        attachments: post.attachmentUrl ? [{ url: post.attachmentUrl, name: 'Adjunto' }] : [],
      },
      author: {
        name: this.userDisplay(post.user),
        avatar: post.user?.person?.photoUrl || undefined,
        role: post.user?.role?.name || 'Publicacion',
      },
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        date: comment.createdAt || new Date(),
        author: comment.user?.person ? `${comment.user.person.firstName} ${comment.user.person.lastName}` : comment.user?.username,
      })),
      commentsCount: post.comments.length,
    };
  }
}

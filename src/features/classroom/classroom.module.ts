import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QUEUE } from '../../infrastruture/queues';
import { AssessmentScoresModule } from '../assessment_scores/assessment_scores.module';
import { AssigmentEntity } from '../assigments/entities/assigment.entity';
import { AssigmentQuestionEntity } from '../assigments/entities/assigment_question.entity';
import { AssigmentQuestionOptionEntity } from '../assigments/entities/assigment_question_option.entity';
import { AssigmentSubmissionEntity } from '../assigment_submissions/entities/assigment_submission.entity';
import { AssessmentScoreEntity } from '../assessment_scores/entities/assessment_score.entity';
import { AssessmentEntity } from '../assessments/entities/assessment.entity';
import { PeriodEntity } from '../periods/entities/period.entity';
import { ChatMessageEntity } from '../chat_messages/entities/chat_message.entity';
import { ChatParticipantEntity } from '../chat_participants/entities/chat_participant.entity';
import { ChatRoomEntity } from '../chat_rooms/entities/chat_room.entity';
import { EnrollmentEntity } from '../enrollments/entities/enrollment.entity';
import { GuardianEntity } from '../guardians/entities/guardian.entity';
import { LearningMaterialEntity } from '../learning_materials/entities/learning_material.entity';
import { StudentGuardianEntity } from '../student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '../students/entities/student.entity';
import { TeacherEntity } from '../teachers/entities/teacher.entity';
import { UserEntity } from '../users/entities/user.entity';
import { SectionCourseEntity } from '../section-course/entities/section-course.entity';
import { VirtualClassroomEntity } from '../virtual_classrooms/entities/virtual_classroom.entity';
import { ClassroomController } from './classroom.controller';
import { ClassroomGateway } from './classroom.gateway';
import { ClassroomProcessor } from './classroom.processor';
import { ClassroomService } from './classroom.service';
import { ClassroomCommentEntity } from './entities/classroom-comment.entity';
import { ClassroomPostEntity } from './entities/classroom-post.entity';
import { TaskCommentEntity } from './entities/task-comment.entity';

@Module({
  imports: [
    AssessmentScoresModule,
    BullModule.registerQueue({ name: QUEUE.CLASSROOM }),
    TypeOrmModule.forFeature([
      ClassroomPostEntity,
      ClassroomCommentEntity,
      TaskCommentEntity,
      LearningMaterialEntity,
      AssigmentEntity,
      AssigmentQuestionEntity,
      AssigmentQuestionOptionEntity,
      AssigmentSubmissionEntity,
      AssessmentEntity,
      AssessmentScoreEntity,
      PeriodEntity,
      ChatMessageEntity,
      ChatParticipantEntity,
      ChatRoomEntity,
      EnrollmentEntity,
      GuardianEntity,
      StudentEntity,
      StudentGuardianEntity,
      TeacherEntity,
      UserEntity,
      SectionCourseEntity,
      VirtualClassroomEntity,
    ]),
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService, ClassroomGateway, ClassroomProcessor],
  exports: [ClassroomService],
})
export class ClassroomModule {}

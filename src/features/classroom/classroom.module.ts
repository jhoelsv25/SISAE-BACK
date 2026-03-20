import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssigmentEntity } from '../assigments/entities/assigment.entity';
import { AssigmentSubmissionEntity } from '../assigment_submissions/entities/assigment_submission.entity';
import { AssessmentScoreEntity } from '../assessment_scores/entities/assessment_score.entity';
import { AssessmentEntity } from '../assessments/entities/assessment.entity';
import { ChatMessageEntity } from '../chat_messages/entities/chat_message.entity';
import { ChatRoomEntity } from '../chat_rooms/entities/chat_room.entity';
import { EnrollmentEntity } from '../enrollments/entities/enrollment.entity';
import { GuardianEntity } from '../guardians/entities/guardian.entity';
import { LearningMaterialEntity } from '../learning_materials/entities/learning_material.entity';
import { StudentGuardianEntity } from '../student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '../students/entities/student.entity';
import { UserEntity } from '../users/entities/user.entity';
import { SectionCourseEntity } from '../section-course/entities/section-course.entity';
import { ClassroomController } from './classroom.controller';
import { ClassroomGateway } from './classroom.gateway';
import { ClassroomService } from './classroom.service';
import { ClassroomCommentEntity } from './entities/classroom-comment.entity';
import { ClassroomPostEntity } from './entities/classroom-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassroomPostEntity,
      ClassroomCommentEntity,
      LearningMaterialEntity,
      AssigmentEntity,
      AssigmentSubmissionEntity,
      AssessmentEntity,
      AssessmentScoreEntity,
      ChatMessageEntity,
      ChatRoomEntity,
      EnrollmentEntity,
      GuardianEntity,
      StudentEntity,
      StudentGuardianEntity,
      UserEntity,
      SectionCourseEntity,
    ]),
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService, ClassroomGateway],
  exports: [ClassroomService],
})
export class ClassroomModule {}

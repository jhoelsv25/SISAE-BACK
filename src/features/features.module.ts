import { Module } from '@nestjs/common';
import { AcademicYearModule } from './academic_years/academic_years.module';
import { ActionsModule } from './actions/actions.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AssessmentScoresModule } from './assessment_scores/assessment_scores.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { AssigmentSubmissionsModule } from './assigment_submissions/assigment_submissions.module';
import { AssigmentsModule } from './assigments/assigments.module';
import { AttendancesModule } from './attendances/attendances.module';
import { BehaviorRecordsModule } from './behavior_records/behavior_records.module';
import { ChatMessagesModule } from './chat_messages/chat_messages.module';
import { ChatParticipantsModule } from './chat_participants/chat_participants.module';
import { ChatRoomsModule } from './chat_rooms/chat_rooms.module';
import { CompetenciesModule } from './competencies/competencies.module';
import { CoursesModule } from './courses/courses.module';
import { EmailLogsModule } from './email_logs/email_logs.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ForumPostsModule } from './forum_posts/forum_posts.module';
import { ForumThreadsModule } from './forum_threads/forum_threads.module';
import { ForumsModule } from './forums/forums.module';
import { GradeLevelModule } from './grade_level/grade_level.module';
import { GradesModule } from './grades/grades.module';
import { GuardiansModule } from './guardians/guardians.module';
import { InstitutionModule } from './institution/institution.module';
import { LearningMaterialsModule } from './learning_materials/learning_materials.module';
import { LearningModulesModule } from './learning_modules/learning_modules.module';
import { ModulesModule } from './modules/modules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { PeriodsModule } from './periods/periods.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PersonsModule } from './persons/persons.module';
import { RolesModule } from './roles/roles.module';
import { SchedulesModule } from './schedules/schedules.module';
import { SectionCourseModule } from './section-course/section-course.module';
import { SectionsModule } from './sections/sections.module';
import { SessionsModule } from './sessions/sessions.module';
import { StudentGuardiansModule } from './student_guardians/student_guardians.module';
import { StudentObservationsModule } from './student_observations/student_observations.module';
import { StudentsModule } from './students/students.module';
import { SubjectAreaModule } from './subject_area/subject_area.module';
import { TeacherAttendancesModule } from './teacher_attendances/teacher_attendances.module';
import { TeachersModule } from './teachers/teachers.module';
import { UsersModule } from './users/users.module';
import { VirtualClassroomsModule } from './virtual_classrooms/virtual_classrooms.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    ModulesModule,
    PermissionsModule,
    ActionsModule,
    AcademicYearModule,
    PeriodsModule,
    GradesModule,
    SectionsModule,
    CoursesModule,
    SectionCourseModule,
    TeachersModule,
    PersonsModule,
    StudentsModule,
    SessionsModule,
    NotificationsModule,
    AttendancesModule,
    SchedulesModule,
    EnrollmentsModule,
    PaymentsModule,
    TeacherAttendancesModule,
    AssessmentsModule,
    AssessmentScoresModule,
    AnnouncementsModule,
    AssigmentSubmissionsModule,
    AssigmentsModule,
    LearningModulesModule,
    BehaviorRecordsModule,
    StudentObservationsModule,
    GuardiansModule,
    StudentGuardiansModule,
    ChatRoomsModule,
    ChatParticipantsModule,
    ChatMessagesModule,
    ForumsModule,
    ForumThreadsModule,
    LearningMaterialsModule,
    VirtualClassroomsModule,
    ForumPostsModule,
    EmailLogsModule,
    CompetenciesModule,
    InstitutionModule,
    GradeLevelModule,
    SubjectAreaModule,
  ],
  controllers: [],
  providers: [],
})
export class FeatureModule {}

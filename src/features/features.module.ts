import { Module } from '@nestjs/common';
import { AcademicYearModule } from './academic_years/academic_years.module';
import { ActionsModule } from './actions/actions.module';
import { GradesModule } from './grades/grades.module';
import { ModulesModule } from './modules/modules.module';
import { PeriodsModule } from './periods/periods.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProfileModule } from './profile/profile.module';
import { RolesModule } from './roles/roles.module';
import { SectionsModule } from './sections/sections.module';
import { UsersModule } from './users/users.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    UsersModule,
    ProfileModule,
    RolesModule,
    ModulesModule,
    PermissionsModule,
    ActionsModule,
    AcademicYearModule,
    PeriodsModule,
    GradesModule,
    SectionsModule,
    ClassroomsModule,
    CoursesModule,
  ],
  controllers: [],
  providers: [],
})
export class FeatureModule {}

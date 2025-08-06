import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { RolesModule } from './roles/roles.module';
import { ModulesModule } from './modules/modules.module';
import { ActionsModule } from './actions/actions.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    UsersModule,
    ProfileModule,
    RolesModule,
    ModulesModule,
    ActionsModule,
    PermissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class FeatureModule {}

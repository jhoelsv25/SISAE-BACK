import { Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProfileModule } from './profile/profile.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { ActionsModule } from './actions/actions.module';

@Module({
  imports: [UsersModule, ProfileModule, RolesModule, ModulesModule, PermissionsModule, ActionsModule],
  controllers: [],
  providers: [],
})
export class FeatureModule {}

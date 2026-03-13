import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferenceEntity } from './entities/user_preference.entity';
import { UserPreferencesController } from './user_preferences.controller';
import { UserPreferencesService } from './user_preferences.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreferenceEntity])],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService],
})
export class UserPreferencesModule {}

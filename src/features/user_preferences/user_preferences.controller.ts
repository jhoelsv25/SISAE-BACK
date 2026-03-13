import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UserPreferencesService } from './user_preferences.service';

@Controller('user-preferences')
export class UserPreferencesController {
  constructor(private readonly service: UserPreferencesService) {}

  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.service.getByUser(userId);
  }

  @Patch(':userId')
  updateByUser(@Param('userId') userId: string, @Body() dto: UpdateUserPreferencesDto) {
    return this.service.updateByUser(userId, dto);
  }

  @Delete(':userId')
  removeByUser(@Param('userId') userId: string) {
    return this.service.removeByUser(userId);
  }
}

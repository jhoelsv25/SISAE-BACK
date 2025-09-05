import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserCrudService } from './services/user-crud.service';
import { UserPasswordService } from './services/user-password.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserCrudService, UserPasswordService],
  exports: [UsersService, TypeOrmModule, UserCrudService, UserPasswordService],
})
export class UsersModule {}

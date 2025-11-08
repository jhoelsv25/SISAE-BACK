import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonEntity } from './entities/person.entity';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';

@Module({
  controllers: [PersonsController],
  providers: [PersonsService],
  imports: [TypeOrmModule.forFeature([PersonEntity])],
})
export class PersonsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './entities/module.entity';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

@Module({
  controllers: [ModulesController],
  providers: [ModulesService],
  imports: [TypeOrmModule.forFeature([ModuleEntity])],
})
export class ModulesModule {}

import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { AuthModule } from '../auth/auth.module';
import { ProjectRepository } from '../database/repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPermission } from '../shared/permission';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository]), AuthModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectPermission],
})
export class ProjectModule {}

import { Module } from '@nestjs/common';
import { ProjectTaskController } from './project-task.controller';
import { ProjectTaskService } from './project-task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import {
  EmployeeRepository,
  ProjectRepository,
  TaskRepository,
} from '../database/repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectRepository]),
    TypeOrmModule.forFeature([TaskRepository]),
    TypeOrmModule.forFeature([EmployeeRepository]),
    AuthModule,
  ],
  controllers: [ProjectTaskController],
  providers: [ProjectTaskService],
})
export class ProjectTaskModule {}

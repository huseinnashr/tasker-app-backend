import { Module } from '@nestjs/common';
import { ProjectTaskController } from './project-task.controller';
import { ProjectTaskService } from './project-task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from '../task/task.repository';
import { AuthModule } from '../auth/auth.module';
import { ProjectRepository } from '../project/project.repository';
import { EmployeeRepository } from '../employee/employee.repository';

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

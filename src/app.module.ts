import {
  Module,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ProjectModule } from './project/project.module';
import { ProjectTaskModule } from './project-task/project-task.module';
import { TaskUpdateModule } from './task-update/task-update.module';
import { UpdateCommentModule } from './update-comment/update-comment.module';
import { FileModule } from './file/file.module';
import { TaskArtifactModule } from './task-artifact/task-artifact.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    AuthModule,
    EmployeeModule,
    ProjectModule,
    ProjectTaskModule,
    TaskUpdateModule,
    UpdateCommentModule,
    FileModule,
    TaskArtifactModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}

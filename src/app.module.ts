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
import { TaskModule } from './task/task.module';
import { ProjectTaskModule } from './project-task/project-task.module';
import { UpdateModule } from './task-update/task-update.module';
import { UpdateCommentModule } from './update-comment/update-comment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    AuthModule,
    EmployeeModule,
    ProjectModule,
    TaskModule,
    ProjectTaskModule,
    UpdateModule,
    UpdateCommentModule,
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

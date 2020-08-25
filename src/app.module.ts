import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as TypeOrmConfig from './config/typeorm.config';
import { APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { ManagerProjectModule } from './manager-project/manager-project.module';
import { ProjectTaskModule } from './project-task/project-task.module';
import { TaskUpdateModule } from './task-update/task-update.module';
import { UpdateCommentModule } from './update-comment/update-comment.module';
import { FileModule } from './file/file.module';
import { TaskArtifactModule } from './task-artifact/task-artifact.module';
import { ErrorsInterceptor } from './core/interceptor';
import { ManagerModule } from './manager/manager.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload', 'profile-picture'),
      serveRoot: '/profile-picture',
    }),
    AuthModule,
    EmployeeModule,
    ManagerProjectModule,
    ProjectTaskModule,
    TaskUpdateModule,
    UpdateCommentModule,
    FileModule,
    TaskArtifactModule,
    ManagerModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}

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
import { ProfilePictureModule } from './profile-picture/profile-picture.module';
import { GraphQLModule } from '@nestjs/graphql';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    RecipesModule,
    AuthModule,
    EmployeeModule,
    ManagerProjectModule,
    ProjectTaskModule,
    TaskUpdateModule,
    UpdateCommentModule,
    FileModule,
    TaskArtifactModule,
    ManagerModule,
    ProfilePictureModule,
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

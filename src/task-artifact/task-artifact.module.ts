import { Module } from '@nestjs/common';
import { TaskArtifactController } from './task-artifact.controller';
import { TaskArtifactService } from './task-artifact.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArtifactRepository,
  TaskRepository,
  UpdateRepository,
} from '../database/repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    TypeOrmModule.forFeature([ArtifactRepository]),
    TypeOrmModule.forFeature([UpdateRepository]),
    AuthModule,
  ],
  controllers: [TaskArtifactController],
  providers: [TaskArtifactService],
})
export class TaskArtifactModule {}

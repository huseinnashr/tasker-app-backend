import { Module } from '@nestjs/common';
import { TaskUpdateController } from './task-update.controller';
import { TaskUpdateService } from './task-update.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TaskRepository,
  UpdateRepository,
  FileRepository,
} from '../database/repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    TypeOrmModule.forFeature([UpdateRepository]),
    TypeOrmModule.forFeature([FileRepository]),
    AuthModule,
  ],
  controllers: [TaskUpdateController],
  providers: [TaskUpdateService],
})
export class UpdateModule {}

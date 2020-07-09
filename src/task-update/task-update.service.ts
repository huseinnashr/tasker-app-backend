import { Injectable } from '@nestjs/common';
import { AppService } from '../core/app.service';
import { TaskRepository, UpdateRepository } from '../database/repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskUpdateService extends AppService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
    @InjectRepository(UpdateRepository) private updateRepo: UpdateRepository,
  ) {
    super();
  }
}

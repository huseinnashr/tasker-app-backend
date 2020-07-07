import { EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { AppRepository } from '../core/app.entity';

@EntityRepository(Task)
export class TaskRepository extends AppRepository<Task> {
  constructor() {
    super('Task');
  }
}

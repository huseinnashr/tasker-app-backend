import { EntityRepository } from 'typeorm';
import { Task } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(Task)
export class TaskRepository extends AppRepository<Task> {
  constructor() {
    super('Task');
  }
}
import { EntityRepository } from 'typeorm';
import { TaskEntity } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(TaskEntity)
export class TaskRepository extends AppRepository<TaskEntity> {
  constructor() {
    super('Task');
  }
}

import * as Faker from 'faker';
import { AppFactory } from '../../core/app.factory';
import { TaskEntity, EmployeeEntity, ProjectEntity } from '../entity';
import { TaskStatus } from '../enum';

interface TaskParam {
  projectPool: ProjectEntity[];
  staffPool: EmployeeEntity[];
}

export class TaskFactory extends AppFactory<TaskEntity, TaskParam> {
  protected get(params: TaskParam): TaskEntity {
    const { projectPool, staffPool } = params;

    const task = new TaskEntity();

    task.title = Faker.lorem.lines(1);
    task.body = Faker.lorem.paragraph();
    task.status = TaskStatus.IN_PROGRESS;
    task.project = Faker.random.arrayElement(projectPool);
    task.staff = Faker.random.arrayElement(staffPool);

    return task;
  }
}

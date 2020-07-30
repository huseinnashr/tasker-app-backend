import * as Faker from 'faker';
import { Factory } from '../core';
import {
  TaskEntity,
  EmployeeEntity,
  ProjectEntity,
} from '../../../src/database/entity';
import { TaskStatus } from '../../../src/database/enum';

interface TaskParam {
  projectPool: ProjectEntity[];
  staffPool: EmployeeEntity[];
}

export class TaskFactory extends Factory<TaskEntity, TaskParam> {
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

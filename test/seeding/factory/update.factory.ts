import * as Faker from 'faker';
import { Factory } from '../core';
import { TaskEntity, UpdateEntity } from '../../../src/database/entity';
import { UpdateType } from '../../../src/database/enum';

interface UpdateParam {
  taskPool: TaskEntity[];
}

export class UpdateFactory extends Factory<UpdateEntity, UpdateParam> {
  protected get(params: UpdateParam): UpdateEntity {
    const { taskPool } = params;

    const update = new UpdateEntity();

    update.title = Faker.lorem.lines(1);
    update.body = Faker.lorem.paragraph();
    update.type = Faker.random.arrayElement([
      UpdateType.PROGRESS,
      UpdateType.QUESTION,
    ]);
    update.task = Faker.random.arrayElement(taskPool);

    return update;
  }
}

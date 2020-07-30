import * as Faker from 'faker';
import { AppFactory } from '../../core/app.factory';
import { TaskEntity, UpdateEntity } from '../entity';
import { UpdateType } from '../enum';

interface UpdateParam {
  taskPool: TaskEntity[];
}

export class UpdateFactory extends AppFactory<UpdateEntity, UpdateParam> {
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

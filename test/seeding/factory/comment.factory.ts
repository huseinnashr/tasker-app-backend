import * as Faker from 'faker';
import { Factory } from '../core';
import { CommentEntity, UpdateEntity } from '../../../src/database/entity';

interface CommentParam {
  updatePool: UpdateEntity[];
}

export class CommentFactory extends Factory<CommentEntity, CommentParam> {
  protected get(params: CommentParam): CommentEntity {
    const { updatePool } = params;

    const comment = new CommentEntity();

    comment.body = Faker.lorem.paragraph();

    const update = Faker.random.arrayElement(updatePool);
    const creatorPool = [update.task.staff, update.task.project.manager];

    comment.update = update;
    comment.creator = Faker.random.arrayElement(creatorPool);

    return comment;
  }
}

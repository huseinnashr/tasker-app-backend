import * as Faker from 'faker';
import { Factory } from '../core';
import {
  ArtifactEntity,
  UpdateEntity,
  TaskEntity,
} from '../../../src/database/entity';

interface ArtifactParam {
  taskPool: TaskEntity[];
  progressPool: UpdateEntity[];
}

export class ArtifactFactory extends Factory<ArtifactEntity, ArtifactParam> {
  protected get(params: ArtifactParam): ArtifactEntity {
    const { taskPool, progressPool } = params;

    const artifact = new ArtifactEntity();

    artifact.description = Faker.lorem.paragraph();

    const task = Faker.random.arrayElement(taskPool);
    artifact.task = task;

    const progress = Faker.random.arrayElement(
      progressPool.filter(p => p.task.id == task.id),
    );
    artifact.update = progress;
    params.progressPool = progressPool.filter(p => p != progress);

    return artifact;
  }
}

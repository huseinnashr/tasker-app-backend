import * as Faker from 'faker';
import { Factory } from '../core';
import { ArtifactEntity, TaskEntity } from '../../../src/database/entity';

interface ArtifactParam {
  taskPool: TaskEntity[];
}

export class ArtifactFactory extends Factory<ArtifactEntity, ArtifactParam> {
  protected get(params: ArtifactParam): ArtifactEntity {
    const { taskPool } = params;

    const artifact = new ArtifactEntity();

    artifact.description = Faker.lorem.paragraph();
    artifact.task = Faker.random.arrayElement(taskPool);

    return artifact;
  }
}

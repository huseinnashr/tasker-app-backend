import * as Faker from 'faker';
import { AppFactory } from '../../core/app.factory';
import { ArtifactEntity, TaskEntity } from '../entity';

interface ArtifactParam {
  taskPool: TaskEntity[];
}

export class ArtifactFactory extends AppFactory<ArtifactEntity, ArtifactParam> {
  protected get(params: ArtifactParam): ArtifactEntity {
    const { taskPool } = params;

    const artifact = new ArtifactEntity();

    artifact.description = Faker.lorem.paragraph();
    artifact.task = Faker.random.arrayElement(taskPool);

    return artifact;
  }
}

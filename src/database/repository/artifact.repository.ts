import { AppRepository } from '../../core/app.repository';
import { EntityRepository } from 'typeorm';
import { ArtifactEntity } from '../entity';

@EntityRepository(ArtifactEntity)
export class ArtifactRepository extends AppRepository<ArtifactEntity> {
  constructor() {
    super('Artifact');
  }
}

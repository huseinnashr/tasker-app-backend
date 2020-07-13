import { EntityRepository } from 'typeorm';
import { ProjectEntity } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends AppRepository<ProjectEntity> {
  constructor() {
    super('Project');
  }
}

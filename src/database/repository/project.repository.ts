import { EntityRepository } from 'typeorm';
import { Project } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(Project)
export class ProjectRepository extends AppRepository<Project> {
  constructor() {
    super('Project');
  }
}

import { EntityRepository } from 'typeorm';
import { Project } from './project.entity';
import { AppRepository } from '../core/app.entity';

@EntityRepository(Project)
export class ProjectRepository extends AppRepository<Project> {
  constructor() {
    super('Project');
  }
}

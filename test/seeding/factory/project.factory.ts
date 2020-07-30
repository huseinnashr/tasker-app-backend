import * as Faker from 'faker';
import { ProjectEntity, EmployeeEntity } from '../../../src/database/entity';
import { Factory } from '../core';
import { ProjectStatus } from '../../../src/database/enum';

interface ProjectParam {
  managerPool: EmployeeEntity[];
}

export class ProjectFactory extends Factory<ProjectEntity, ProjectParam> {
  protected get(params: ProjectParam): ProjectEntity {
    const { managerPool } = params;

    const project = new ProjectEntity();
    project.title = Faker.lorem.lines(1);
    project.body = Faker.lorem.paragraph();
    project.status = ProjectStatus.IN_PROGRESS;
    project.manager = Faker.random.arrayElement(managerPool);

    return project;
  }
}

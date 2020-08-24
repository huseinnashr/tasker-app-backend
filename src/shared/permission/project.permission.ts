import { ModelPermission } from '../../core/model-permission';
import { ProjectEntity, EmployeeEntity } from '../../database/entity';

export class ProjectPermission extends ModelPermission<
  ProjectEntity,
  EmployeeEntity
> {
  create(parent: EmployeeEntity, emp: EmployeeEntity): boolean {
    return parent.id === emp.id;
  }
  readAll(parent: EmployeeEntity, emp: EmployeeEntity): boolean {
    return parent.id === emp.id;
  }
  read(entity: ProjectEntity, emp: EmployeeEntity): boolean {
    return (
      entity.isManager(emp) || entity.tasks.map(e => e.staff).includes(emp)
    );
  }
  update(entity: ProjectEntity, emp: EmployeeEntity): boolean {
    return entity.isManager(emp);
  }
  delete(entity: ProjectEntity, emp: EmployeeEntity): boolean {
    return entity.isManager(emp);
  }
}

import { ModelPermission } from '../../core/model-permission';
import { ProjectEntity, EmployeeEntity } from '../../database/entity';
import { Role } from '../../database/enum';

export class ProjectPermission extends ModelPermission<ProjectEntity, null> {
  create(parent: null, emp: EmployeeEntity): boolean {
    return emp.role === Role.MANAGER;
  }
  readAll(parent: null, emp: EmployeeEntity): boolean {
    return true;
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

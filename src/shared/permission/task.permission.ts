import { ModelPermission } from '../../core/model-permission';
import {
  TaskEntity,
  EmployeeEntity,
  ProjectEntity,
} from '../../database/entity';

export class TaskPermission extends ModelPermission<TaskEntity, ProjectEntity> {
  create(parent: ProjectEntity, emp: EmployeeEntity): boolean {
    return parent.isManager(emp);
  }
  readAll(): boolean {
    return true;
  }
  read(): boolean {
    return true;
  }
  update(entity: TaskEntity, emp: EmployeeEntity): boolean {
    return entity.project.isManager(emp);
  }
  delete(entity: TaskEntity, emp: EmployeeEntity): boolean {
    return entity.project.isManager(emp);
  }
}

import { ModelPermission } from '../../core/model-permission';
import {
  TaskEntity,
  EmployeeEntity,
  ProjectEntity,
} from '../../database/entity';

export class TaskPermission extends ModelPermission<TaskEntity, ProjectEntity> {
  protected create(parent: ProjectEntity, emp: EmployeeEntity): boolean {
    return parent.manager.id === emp.id;
  }
  protected read(): boolean {
    return true;
  }
  protected update(entity: TaskEntity, emp: EmployeeEntity): boolean {
    return entity.project.manager.id === emp.id;
  }
  protected delete(entity: TaskEntity, emp: EmployeeEntity): boolean {
    return entity.project.manager.id === emp.id;
  }
}

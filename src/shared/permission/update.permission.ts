import { ModelPermission } from '../../core/model-permission';
import {
  UpdateEntity,
  TaskEntity,
  EmployeeEntity,
} from '../../database/entity';

export class UpdatePermission extends ModelPermission<
  UpdateEntity,
  TaskEntity
> {
  create(parent: TaskEntity, emp: EmployeeEntity): boolean {
    return parent.isStaff(emp);
  }
  readAll(parent: TaskEntity, emp: EmployeeEntity): boolean {
    return true;
  }
  read(entity: UpdateEntity, emp: EmployeeEntity): boolean {
    return true;
  }
  update(entity: UpdateEntity, emp: EmployeeEntity): boolean {
    return entity.task.isStaff(emp);
  }
  delete(entity: UpdateEntity, emp: EmployeeEntity): boolean {
    return entity.task.isStaff(emp);
  }
}

import { ModelPermission } from '../../core/model-permission';
import {
  CommentEntity,
  UpdateEntity,
  EmployeeEntity,
} from '../../database/entity';

export class CommentPermission extends ModelPermission<
  CommentEntity,
  UpdateEntity
> {
  create(parent: UpdateEntity, emp: EmployeeEntity): boolean {
    return parent.task.isStaff(emp) || parent.task.project.isManager(emp);
  }
  readAll(parent: UpdateEntity, emp: EmployeeEntity): boolean {
    return true;
  }
  read(entity: CommentEntity, emp: EmployeeEntity): boolean {
    return true;
  }
  update(entity: CommentEntity, emp: EmployeeEntity): boolean {
    return entity.isCreator(emp);
  }
  delete(entity: CommentEntity, emp: EmployeeEntity): boolean {
    return entity.isCreator(emp);
  }
}

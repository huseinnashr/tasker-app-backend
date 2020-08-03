import { ModelPermission } from '../../core/model-permission';
import {
  ArtifactEntity,
  TaskEntity,
  EmployeeEntity,
} from '../../database/entity';

export class ArtifactPermission extends ModelPermission<
  ArtifactEntity,
  TaskEntity
> {
  create(parent: TaskEntity, emp: EmployeeEntity): boolean {
    return parent.project.isManager(emp);
  }
  readAll(parent: TaskEntity, emp: EmployeeEntity): boolean {
    return true;
  }
  read(entity: ArtifactEntity, emp: EmployeeEntity): boolean {
    return true;
  }
  update(entity: ArtifactEntity, emp: EmployeeEntity): boolean {
    return entity.task.project.isManager(emp);
  }
  delete(entity: ArtifactEntity, emp: EmployeeEntity): boolean {
    return entity.task.project.isManager(emp);
  }
}

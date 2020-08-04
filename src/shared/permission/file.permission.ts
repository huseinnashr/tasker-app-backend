import { ModelPermission } from '../../core/model-permission';
import {
  FileEntity,
  UpdateEntity,
  EmployeeEntity,
} from '../../database/entity';

export class FilePermission extends ModelPermission<FileEntity, UpdateEntity> {
  create(parent: UpdateEntity, emp: EmployeeEntity): boolean {
    return true;
  }
  readAll(parent: UpdateEntity, emp: EmployeeEntity): boolean {
    return false;
  }
  read(file: FileEntity, employee: EmployeeEntity): boolean {
    let can = file.isOwner(employee);

    if (!can && file.update) {
      const project = file.update.task.project;
      can = can || project.isManager(employee);

      const employeeIds = project.tasks.map(task => task.staff.id);
      can = can || employeeIds.includes(employee.id);
    }

    return can;
  }
  update(entity: FileEntity, emp: EmployeeEntity): boolean {
    return false;
  }
  delete(entity: FileEntity, emp: EmployeeEntity): boolean {
    return false;
  }
}

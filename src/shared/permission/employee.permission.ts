import { ModelPermission } from '../../core/model-permission';
import { EmployeeEntity } from '../../database/entity';
import { Role } from '../../database/enum';

export class EmployeePermission extends ModelPermission<EmployeeEntity, null> {
  create(parent: null, emp: EmployeeEntity): boolean {
    return emp.role === Role.ADMIN;
  }
  readAll(parent: null, emp: EmployeeEntity): boolean {
    return emp.role === Role.ADMIN;
  }
  read(entity: EmployeeEntity, emp: EmployeeEntity): boolean {
    return true;
  }
  update(entity: EmployeeEntity, emp: EmployeeEntity): boolean {
    return emp.role === Role.ADMIN;
  }
  delete(entity: EmployeeEntity, emp: EmployeeEntity): boolean {
    return emp.role === Role.ADMIN;
  }
}

import { EmployeeEntity } from '../database/entity';
import { Injectable } from '@nestjs/common';

class ListPermission {
  create: boolean;
}

class EntityPermission {
  update: boolean;
  delete: boolean;
}

/** CRUD Model Permission, with type T and parent type U */
@Injectable()
export abstract class ModelPermission<T, U> {
  /** Get List Level Permission */
  getList(parent: U, emp: EmployeeEntity): ListPermission {
    return {
      create: this.create(parent, emp),
    };
  }

  /** Get Entity Level Permission */
  getEntity(entity: T, emp: EmployeeEntity): EntityPermission {
    return {
      update: this.update(entity, emp),
      delete: this.delete(entity, emp),
    };
  }

  abstract create(parent: U, emp: EmployeeEntity): boolean;
  abstract readAll(parent: U, emp: EmployeeEntity): boolean;
  abstract read(entity: T, emp: EmployeeEntity): boolean;
  abstract update(entity: T, emp: EmployeeEntity): boolean;
  abstract delete(entity: T, emp: EmployeeEntity): boolean;
}

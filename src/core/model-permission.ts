import { EmployeeEntity } from '../database/entity';

class ListPermission {
  create: boolean;
}

class EntityPermission {
  update: boolean;
  delete: boolean;
}

/** CRUD Model Permission, with type T and parent type U */
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

  /** Get Entity Level Read Permission */
  getRead(entity: T, emp: EmployeeEntity): boolean {
    return this.read(entity, emp);
  }

  protected abstract create(parent: U, emp: EmployeeEntity): boolean;
  protected abstract read(entity: T, emp: EmployeeEntity): boolean;
  protected abstract update(entity: T, emp: EmployeeEntity): boolean;
  protected abstract delete(entity: T, emp: EmployeeEntity): boolean;
}

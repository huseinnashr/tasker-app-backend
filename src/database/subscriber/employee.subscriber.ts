import {
  EntitySubscriberInterface,
  Connection,
  InsertEvent,
  UpdateEvent,
  EventSubscriber,
} from 'typeorm';
import { Employee } from '../entity/employee.entity';
import * as bcrypt from 'bcrypt';

@EventSubscriber()
export class EmployeeSubscriber implements EntitySubscriberInterface<Employee> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo(): any {
    return Employee;
  }

  private async hashPassword(
    event: InsertEvent<Employee> | UpdateEvent<Employee>,
  ) {
    event.entity.salt = await bcrypt.genSalt();
    event.entity.password = await bcrypt.hash(
      event.entity.password,
      event.entity.salt,
    );
  }

  async beforeInsert(event: InsertEvent<Employee>): Promise<void> {
    await this.hashPassword(event);
  }

  async beforeUpdate(event: UpdateEvent<Employee>): Promise<void> {
    if (event.entity.password !== event.databaseEntity.password) {
      await this.hashPassword(event);
    }
  }
}

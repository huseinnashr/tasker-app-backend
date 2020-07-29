import {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  EventSubscriber,
} from 'typeorm';
import { EmployeeEntity } from '../entity/employee.entity';
import * as bcrypt from 'bcrypt';

@EventSubscriber()
export class EmployeeSubscriber
  implements EntitySubscriberInterface<EmployeeEntity> {
  listenTo(): any {
    return EmployeeEntity;
  }

  private async hashPassword(
    event: InsertEvent<EmployeeEntity> | UpdateEvent<EmployeeEntity>,
  ) {
    event.entity.salt = await bcrypt.genSalt();
    event.entity.password = await bcrypt.hash(
      event.entity.password,
      event.entity.salt,
    );
  }

  async beforeInsert(event: InsertEvent<EmployeeEntity>): Promise<void> {
    await this.hashPassword(event);
  }

  async beforeUpdate(event: UpdateEvent<EmployeeEntity>): Promise<void> {
    if (event.entity.password !== event.databaseEntity.password) {
      await this.hashPassword(event);
    }
  }
}

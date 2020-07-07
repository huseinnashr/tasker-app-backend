import { Repository, ObjectID } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export class AppRepository<T> extends Repository<T> {
  constructor(private entityName: string) {
    super();
  }

  async findOneOrException(id?: string | number | Date | ObjectID): Promise<T> {
    const entity = await this.findOne(id);

    if (!entity) {
      throw new NotFoundException(
        `${this.entityName} with id:${id} was not found`,
      );
    }

    return entity;
  }
}

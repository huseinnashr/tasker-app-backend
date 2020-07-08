import { Repository, ObjectID, FindOneOptions, FindConditions } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export class AppRepository<T> extends Repository<T> {
  constructor(private entityName: string) {
    super();
  }

  async findOneOrException(
    id?: string | number | Date | ObjectID,
    options?: FindOneOptions<T>,
  ): Promise<T>;

  async findOneOrException(
    conditions?: FindConditions<T>,
    options?: FindOneOptions<T>,
  ): Promise<T>;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async findOneOrException(any: any, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.findOne(any, options);

    if (!entity) {
      throw new NotFoundException(`${this.entityName} does not exist`);
    }

    return entity;
  }
}

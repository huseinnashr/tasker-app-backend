import {
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';
import { ClassType } from 'class-transformer/ClassTransformer';
import { plainToClass } from 'class-transformer';

export abstract class AppService {
  /** if foreign entity does not exist return '422 Unprocessible Entity'  */
  protected existOrUnprocessable<T>(entity: T, entityName: string): void {
    if (!entity) {
      throw new UnprocessableEntityException(
        `The referred ${entityName} does not exist`,
      );
    }
  }

  /** if can not manage return '403 Forbidden' */
  protected canManage(can: boolean, entityName: string): void {
    if (!can) {
      throw new ForbiddenException(
        `You don't have the permission to manage this ${entityName}`,
      );
    }
  }

  /** if can not manage return '403 Forbidden' */
  protected canView(can: boolean, entityName: string): void {
    if (!can) {
      throw new ForbiddenException(
        `You don't have the permission to veiw this ${entityName}`,
      );
    }
  }
  protected transform<T>(cls: ClassType<T>, data: T): T;

  protected transform<T>(cls: ClassType<T>, data: T): T {
    return plainToClass(cls, data, { excludeExtraneousValues: true });
  }
}

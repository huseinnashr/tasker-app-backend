import {
  UnprocessableEntityException,
  ForbiddenException,
} from '@nestjs/common';

export abstract class AppService {
  /** if foreign entity does not exist return '422 Unprocessible Entity'  */
  async existOrUnprocessable<T>(
    entityPromise: Promise<T | undefined>,
    entityName: string,
  ): Promise<T> {
    const entity = await entityPromise;
    if (!entity) {
      throw new UnprocessableEntityException(
        `The referred ${entityName} does not exist`,
      );
    }
    return entity;
  }

  /** if can not manage return '403 Forbidden' */
  canManage(can: boolean, entityName: string): void {
    if (!can) {
      throw new ForbiddenException(
        `You don't have the permission to manage this ${entityName}`,
      );
    }
  }

  /** if can not manage return '403 Forbidden' */
  canView(can: boolean, entityName: string): void {
    if (!can) {
      throw new ForbiddenException(
        `You don't have the permission to veiw this ${entityName}`,
      );
    }
  }
}

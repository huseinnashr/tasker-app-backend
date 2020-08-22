import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

/** Do a runtime conversion to cls T, remove extra fields */
export const convertTo = <T>(cls: ClassType<T>, object: T): T => {
  return plainToClass(cls, object, { excludeExtraneousValues: true });
};

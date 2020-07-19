import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export function TransformResponse<T>(classType: ClassType<T>): any {
  return applyDecorators(UseInterceptors(new _TransformInterceptor(classType)));
}

class _TransformInterceptor<T> implements NestInterceptor<Partial<T>, T> {
  constructor(private readonly classType: ClassType<T>) {}

  intercept(_: ExecutionContext, next: CallHandler): Observable<T> {
    return next
      .handle()
      .pipe(
        map(data =>
          plainToClass(this.classType, data, { excludeExtraneousValues: true }),
        ),
      );
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        if (err.code === '23505') {
          const [column, value] = err.detail
            .match(/\(.*?\)/g)
            .map((x: string) => x.replace(/[()]/g, ''));
          const message = `${column}: ${value} is already exist`;
          return throwError(new BadRequestException(message));
        } else if (err.code === 'ENOENT') {
          throw new NotFoundException();
        } else {
          return throwError(err);
        }
      }),
    );
  }
}

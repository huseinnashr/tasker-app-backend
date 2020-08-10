import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
  BadRequestException,
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
        } else {
          return throwError(err);
        }
      }),
    );
  }
}

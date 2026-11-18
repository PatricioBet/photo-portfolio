import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const traceId = (request as any).traceId ?? crypto.randomUUID();
    (request as any).traceId = traceId;

    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - start;
        const method = request.method;
        const url = request.url;
        console.info({ traceId, method, url, elapsedMs: elapsed });
      })
    );
  }
}

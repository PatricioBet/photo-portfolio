import {
  HttpException,
  HttpStatus,
  Injectable,
  ExceptionFilter,
  ArgumentsHost,
} from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const traceId = (request as any).traceId ?? "unknown";

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      response.status(status).json({
        ...(typeof res === "string" ? { message: res } : res),
        traceId,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      traceId,
      timestamp: new Date().toISOString(),
    });
  }
}

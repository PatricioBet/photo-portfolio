import { HttpException, HttpStatus, Injectable, NestFilter } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class HttpExceptionFilter implements NestFilter {
  catch(exception: unknown, host: any, response: Response, request: Request) {
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

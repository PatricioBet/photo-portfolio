import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import compression from "compression";
import AppModule from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TraceIdInterceptor } from "./common/interceptors/trace-id.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(
    console.log.bind(console)
  );

  app.use(helmet());
  app.enableCors({
    origin: [
      "https://photo.patriciobet.dev",
      "https://admin-photo.patriciobet.dev",
    ],
    credentials: true,
  });
  app.use(compression());
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      forbidUnknownValues: false,
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TraceIdInterceptor());

  const port = process.env.API_PORT ?? 3000;
  await app.listen(port);

  console.log(`API running on port ${port}`);
  console.log(`Database: ${process.env.POSTGRES_URL?.replace(/\/\/.*@/, "//***@") ?? "not configured"}`);
  console.log(`Redis: ${process.env.REDIS_HOST ?? "localhost"}`);
  console.log(`Storage: ${process.env.LOCAL_STORAGE_PATH ?? "not configured"}`);
}

bootstrap().catch((err) => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});

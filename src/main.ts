import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://expanses-app-clientside-production.up.railway.app',
    credentials: true,
  });

  await app.listen(process.env.PORT || 8000);
}
bootstrap();

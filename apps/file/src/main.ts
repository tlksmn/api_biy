/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 2 * 60 * 1000, // 30 minutes
      max: 5, // limit each IP to 5 requests per windowMs
    })
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  await app.listen(3002);
  Logger.log(`🚀 File application is running on: http://localhost:3002`);
}

bootstrap().then();

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { AppModule } from './app/app.module';
import * as process from 'process';

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'dev'
      ? 'http://localhost:4200'
      : 'https://mp.biy.kz',
  credentials: true,
  optionSuccessStatus: 200,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 2 * 60 * 1000, // 2 minutes
      max: 10, // limit each IP to 10 requests per windowMs
    })
  );
  app.enableCors(corsOptions);
  await app.listen(3003);
  Logger.log(`🚀 Admin application is running on: http://localhost:3003`);
}

bootstrap().then();

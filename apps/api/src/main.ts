/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as process from 'process';

import { AppModule } from './app/app.module';

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
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.enableCors(corsOptions);
  await app.listen(3000);
  Logger.log(`🚀 Api application is running on: http://localhost:3000/ `);
}

bootstrap().then();

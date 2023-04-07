/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import * as process from 'process';

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'dev'
      ? 'http://localhost:4200'
      : 'https://kaspi.kz',
  credentials: true,
  optionSuccessStatus: 200,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  Logger.log(`🚀 Extension application is running on: http://localhost:3001/`);
}

bootstrap().then();

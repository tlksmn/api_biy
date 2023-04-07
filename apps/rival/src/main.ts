/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
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
  app.enableCors(corsOptions);
  await app.init();
  Logger.log(`🚀 Rival application is running in background!`);
}

bootstrap().then();

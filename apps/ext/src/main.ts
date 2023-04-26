/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as path from 'path';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

const corsOptions = {
  origin: 'https://kaspi.kz',
  credentials: true,
  optionSuccessStatus: 200,
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors(corsOptions);
  app.set('views', path.join(__dirname, 'assets'));
  app.set('view engine', 'pug');
  app.use(express.static(path.join(__dirname, 'assets')));

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
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );

  await app.listen(3001);
  Logger.log(`🚀 Extension application is running on: http://localhost:3001/`);
}

bootstrap().then();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './config/postgres.config';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';

@Module({
  providers: [],
  exports: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.env${
        process.env.NODE_ENV === 'dev' ? '.dev' : ''
      }`,
    }),
    TypeOrmModule.forRootAsync(postgresConfig()),
  ],
})
export class DataBaseModule {}

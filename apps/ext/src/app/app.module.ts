import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  DataBaseModule,
  RivalConfigEntity,
  SellerEntity,
  UserEntity,
} from '@biy/database';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    DataBaseModule,
    TypeOrmModule.forFeature([UserEntity, SellerEntity, RivalConfigEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

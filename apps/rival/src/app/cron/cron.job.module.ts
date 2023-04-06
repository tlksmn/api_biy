import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProductEntity,
  RivalConfigEntity,
  SellerEntity,
  UserEntity,
} from '@biy/database';

import { RivalJob } from './rival.job';
import { ApiModule } from '../api/api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SellerEntity,
      ProductEntity,
      RivalConfigEntity,
      UserEntity,
    ]),
    ApiModule,
  ],
  providers: [RivalJob],
  exports: [RivalJob],
})
export class CronJobModule {}

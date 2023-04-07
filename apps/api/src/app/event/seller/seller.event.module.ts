import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CityEntity,
  PointConfigEntity,
  PointEntity,
  ProductCountEntity,
  ProductEntity,
  RivalConfigEntity,
  SellerEntity,
  UserEntity,
} from '@biy/database';

import { AddSellerEvent } from './add.seller.event';
import { UpdateSellerEvent } from './update.seller.event';
import { MainSellerEvent } from './main.seller.event';
import { KaspiModule } from '../../mp/kaspi/kaspi.module';

@Module({
  providers: [MainSellerEvent, AddSellerEvent, UpdateSellerEvent],
  imports: [
    TypeOrmModule.forFeature([
      CityEntity,
      PointConfigEntity,
      PointEntity,
      ProductCountEntity,
      ProductEntity,
      RivalConfigEntity,
      SellerEntity,
      UserEntity,
    ]),
    KaspiModule,
    ConfigModule,
  ],
})
export class SellerEventModule {}

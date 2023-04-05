import { Module } from '@nestjs/common';

import { AddSellerEvent } from './add.seller.event';
import { UpdateSellerEvent } from './update.seller.event';
import { MainSellerEvent } from './main.seller.event';
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
  ],
})
export class SellerEventModule {}

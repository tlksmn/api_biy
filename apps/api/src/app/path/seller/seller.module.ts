import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from '@biy/database';
import { KaspiModule } from '../../mp/kaspi/kaspi.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SellerService],
  controllers: [SellerController],
  imports: [
    TypeOrmModule.forFeature([SellerEntity]),
    KaspiModule,
    ConfigModule,
  ],
})
export class SellerModule {}

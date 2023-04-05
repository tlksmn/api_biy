import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from '@biy/database';
import { KaspiModule } from '../../mp/kaspi/kaspi.module';

@Module({
  providers: [SellerService],
  controllers: [SellerController],
  imports: [TypeOrmModule.forFeature([SellerEntity]), KaspiModule],
})
export class SellerModule {}

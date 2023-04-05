import { Module } from '@nestjs/common';
import { SellerEventModule } from './seller/seller.event.module';

@Module({
  imports: [SellerEventModule],
})
export class EventModule {}

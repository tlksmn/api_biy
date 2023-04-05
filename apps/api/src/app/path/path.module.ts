import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SellerModule } from './seller/seller.module';
import { ProductModule } from './product/product.module';
import { PointConfigModule } from './pointConfig/pointConfig.module';
import { RivalConfigModule } from './rivalConfig/rivalConfig.module';

@Module({
  imports: [
    AuthModule,
    SellerModule,
    ProductModule,
    PointConfigModule,
    RivalConfigModule,
  ],
})
export class PathModule {}

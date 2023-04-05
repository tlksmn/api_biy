import { Module } from '@nestjs/common';
import { KaspiService } from './kaspi.service';

@Module({
  providers: [KaspiService],
  exports: [KaspiService],
})
export class KaspiModule {}

import { Module } from '@nestjs/common';
import { KaspiApi } from './kaspi.api';
import { ProxyModule } from '../proxy/proxy.module';

@Module({
  providers: [KaspiApi],
  exports: [KaspiApi],
  imports: [ProxyModule],
})
export class ApiModule {}

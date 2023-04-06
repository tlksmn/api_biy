import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyEntity } from '@biy/database';

@Module({
  providers: [ProxyService],
  exports: [ProxyService],
  imports: [TypeOrmModule.forFeature([ProxyEntity])],
})
export class ProxyModule {}

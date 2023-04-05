import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointConfigEntity } from '@biy/database';
import { PointConfigService } from './pointConfig.service';
import { PointConfigController } from './pointConfig.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PointConfigEntity])],
  providers: [PointConfigService],
  controllers: [PointConfigController],
})
export class PointConfigModule {}

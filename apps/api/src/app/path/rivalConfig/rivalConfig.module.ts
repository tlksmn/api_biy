import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RivalConfigEntity } from '@biy/database';

import { RivalConfigController } from './rivalConfig.controller';
import { RivalConfigService } from './rivalConfig.service';

@Module({
  controllers: [RivalConfigController],
  providers: [RivalConfigService],
  imports: [TypeOrmModule.forFeature([RivalConfigEntity])],
})
export class RivalConfigModule {}

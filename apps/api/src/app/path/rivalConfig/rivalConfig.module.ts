import { Module } from '@nestjs/common';
import { RivalConfigController } from './rivalConfig.controller';
import { RivalConfigService } from './rivalConfig.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RivalConfigEntity } from '@biy/database';

@Module({
  controllers: [RivalConfigController],
  providers: [RivalConfigService],
  imports: [TypeOrmModule.forFeature([RivalConfigEntity])],
})
export class RivalConfigModule {}

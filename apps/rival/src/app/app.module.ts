import { Module } from '@nestjs/common';
import { DataBaseModule } from '@biy/database';
import { ScheduleModule } from '@nestjs/schedule';

import { AppService } from './app.service';
import { CronJobModule } from './cron/cron.job.module';

@Module({
  imports: [DataBaseModule, CronJobModule, ScheduleModule.forRoot()],
  providers: [AppService],
})
export class AppModule {}

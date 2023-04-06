import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RivalJob } from './cron/rival.job';

@Injectable()
export class AppService {
  constructor(private readonly rivalJob: RivalJob) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async job() {
    await this.rivalJob.handle();
  }
}

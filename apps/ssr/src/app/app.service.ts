import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly startedDate: Date = new Date();

  getData(): { date: string } {
    return { date: this.startedDate.toISOString() };
  }
}

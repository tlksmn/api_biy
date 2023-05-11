import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { date: string } {
    return { date: new Date().toISOString() };
  }
}

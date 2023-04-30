import { Injectable } from '@nestjs/common';
import { EventHandleI } from '../event.handle.interface';

@Injectable()
export class UpdateSellerEvent implements EventHandleI {
  async handle(payload) {}
}

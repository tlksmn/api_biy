import { Module } from '@nestjs/common';
import { DataBaseModule } from '@biy/database';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PathModule } from './path/path.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    PathModule,
    EventModule,
    DataBaseModule,
    EventEmitterModule.forRoot(),
    // CacheModule.register({ ttl: 240_000, isGlobal: true, max: 60 }),
  ],
})
export class AppModule {}

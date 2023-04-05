import { CacheModule, Module } from '@nestjs/common';
import { DataBaseModule } from '@biy/database';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PathModule } from './path/path.module';
import { EventModule } from './event/event.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    PathModule,
    EventModule,
    DataBaseModule,
    EventEmitterModule.forRoot(),
    CacheModule.register({ ttl: 240_000, isGlobal: true, max: 60 }),
  ],
})
export class AppModule {}

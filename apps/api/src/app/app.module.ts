import { Module } from '@nestjs/common';
import { DataBaseModule } from '@biy/database';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PathModule } from './path/path.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [DataBaseModule, PathModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

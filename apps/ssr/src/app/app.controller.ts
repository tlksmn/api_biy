import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

import { AppService } from './app.service';
import * as process from 'process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getData() {
    return this.appService.getData();
  }

  @Get('robots.txt')
  getRobotsIndex(@Res() response: Response) {
    const file = createReadStream(join(process.cwd() + '/robots.txt'));
    file.pipe(response);
  }
  @Get('sitemap_index.xml')
  getSiteMapIndex(@Res() response: Response) {
    const file = createReadStream(join(process.cwd() + '/sitemap.xml'));
    file.pipe(response);
  }
}

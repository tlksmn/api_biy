import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AdminRoute } from '@biy/dto';
import { UpdateUserDto } from '@biy/dto';

import { AppService } from './app.service';
import { GetUsersDto } from '@biy/dto';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  private readonly adminPassword =
    this.configService.get<string>('ADMIN_PASSWORD');

  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @Get(AdminRoute.list)
  getList(@Query() query: GetUsersDto) {
    this.checkPassword(query.pass);
    return this.appService.getUserList();
  }

  @Post(AdminRoute.update)
  updateUser(@Body() data: UpdateUserDto) {
    this.checkPassword(data.pass);
    return this.appService.updateUser(data);
  }

  private checkPassword(password: string) {
    if (password !== this.adminPassword) {
      throw new HttpException('IDKNU', HttpStatus.NOT_ACCEPTABLE);
    }
  }
}

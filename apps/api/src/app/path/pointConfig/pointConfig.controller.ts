import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PointConfigRoute, UpdatePointConfigDto } from '@biy/dto';
import { UserEntity } from '@biy/database';

import { PointConfigService } from './pointConfig.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '../auth/user/user.decorator';

@Controller(PointConfigRoute.path)
@UseGuards(JwtGuard)
export class PointConfigController {
  constructor(private readonly pointConfigService: PointConfigService) {}

  @Post(PointConfigRoute.update)
  update(@Body() data: UpdatePointConfigDto, @User() user: UserEntity) {
    return this.pointConfigService.update(data, user);
  }
}

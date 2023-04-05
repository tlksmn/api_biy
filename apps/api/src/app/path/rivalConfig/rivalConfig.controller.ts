import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RivalConfigRoute, UpdateRivalConfigDto } from '@biy/dto';
import { UserEntity } from '@biy/database';

import { RivalConfigService } from './rivalConfig.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '../auth/user/user.decorator';

@Controller(RivalConfigRoute.path)
@UseGuards(JwtGuard)
export class RivalConfigController {
  constructor(private readonly rivalConfigService: RivalConfigService) {}

  @Post(RivalConfigRoute.update)
  update(@Body() data: UpdateRivalConfigDto, @User() user: UserEntity) {
    return this.rivalConfigService.update(data, user);
  }
}

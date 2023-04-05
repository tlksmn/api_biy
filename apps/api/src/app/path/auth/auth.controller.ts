import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserEntity } from '@biy/database';
import { AuthRoute, SignUpDto } from '@biy/dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { User } from './user/user.decorator';
import { JwtGuard } from './guard/jwt.guard';
import { LocalGuard } from './guard/local.guard';

@Controller(AuthRoute.path)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Get(AuthRoute.me)
  @UseGuards(JwtGuard)
  getMe(@User() user: UserEntity) {
    return user;
  }

  @Post(AuthRoute.signIn)
  @UseGuards(LocalGuard)
  signIn(@User() user: UserEntity, @Res() response: Response) {
    const cookie = this.authService.getCookie(user.id);
    response.setHeader('Set-Cookie', cookie);
    response.send(user);
  }

  @Post(AuthRoute.signUp)
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @Get(AuthRoute.signOut)
  @UseGuards(JwtGuard)
  signOut(@Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      `Authentication=; HttpOnly; Path=/; Max-Age=${this.configService.get(
        'JWT_EXPIRATION_TIME'
      )}`
    );
    response.send({ message: 'successfully sign out' });
  }
}

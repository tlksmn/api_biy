import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  AddSellerDto,
  ReintegrateDto,
  SellerRoute,
  UpdateSellerDto,
} from '@biy/dto';
import { UserEntity } from '@biy/database';

import { SellerService } from './seller.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '../auth/user/user.decorator';

@Controller(SellerRoute.path)
@UseGuards(JwtGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get(SellerRoute.getList)
  getList(@User() user: UserEntity) {
    return this.sellerService.getList(user);
  }

  @Post(SellerRoute.add)
  addSeller(@Body() data: AddSellerDto, @User() user: UserEntity) {
    this.sellerService.catchUserIfNotAccessed(user);
    return this.sellerService.addSeller(data, user);
  }

  @Get(SellerRoute.byId)
  getById(@Param('sellerId') sellerId: number, @User() user: UserEntity) {
    return this.sellerService.getById(sellerId, user);
  }

  @Post(SellerRoute.update)
  updateSeller(@User() user: UserEntity, @Body() data: UpdateSellerDto) {
    return this.sellerService.update(data, user);
  }

  @Post(SellerRoute.reintegrate)
  reintegrateSeller(@User() user: UserEntity, @Body() data: ReintegrateDto) {
    return this.sellerService.reintegrate(user, data);
  }

  @Post(SellerRoute.delete)
  deleteSeller(@User() user: UserEntity, @Body() data: ReintegrateDto) {
    return this.sellerService.delete(user, data.sellerId);
  }
}

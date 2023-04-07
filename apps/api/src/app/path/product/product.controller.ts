import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ProductGetDto, ProductRoute } from '@biy/dto';
import { UserEntity } from '@biy/database';

import { ProductService } from './product.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '../auth/user/user.decorator';
import { QueryFailedFilter } from '@biy/common';

@Controller(ProductRoute.path)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtGuard)
  @Get(ProductRoute.getList)
  @UseFilters(new QueryFailedFilter())
  getList(@Query() data: ProductGetDto, @User() user: UserEntity) {
    return this.productService.getList(user, data);
  }
}

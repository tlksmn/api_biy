import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { ActivateDto, ExtensionRoute, UpdateRivalDto } from '@biy/dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('policy')
  @Render('ext')
  getPolicy() {
    return {};
  }

  @Get(`${ExtensionRoute.list}/:sellerId`)
  getRivalConfig(@Param('sellerId') sellerSysId: string) {
    return this.appService.getRivalConfig(sellerSysId);
  }

  @Post(ExtensionRoute.activate)
  activate(@Body() data: ActivateDto) {
    return this.appService.activate(data);
  }

  @Post(ExtensionRoute.update)
  updateRivalConfig(@Body() data: UpdateRivalDto) {
    return this.appService.updateRival(data);
  }
}

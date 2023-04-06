import { Controller, Get, Param, Response } from '@nestjs/common';
import { Response as ResponseEx } from 'express';
import { FileRoute } from '@biy/dto';

import { AppService } from './app.service';
import { XmlService } from './file/xml.service';
import { XlsxService } from './file/xlsx.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly xmlService: XmlService,
    private readonly xlsxService: XlsxService
  ) {}

  @Get(`${FileRoute.xml}/:sellerSysId`)
  async getXml(
    @Param('sellerSysId') sellerSysId: string,
    @Response() res: ResponseEx
  ) {
    const data = await this.appService.getData(sellerSysId);
    const xml: ArrayBuffer = this.xmlService.generate(
      data.seller,
      data.products
    );

    res.set('Content-Type', 'text/xml');
    res.send(xml);
  }

  @Get(`${FileRoute.xlsx}/:sellerSysId`)
  async getXlsx(
    @Param('sellerSysId') sellerSysId: string,
    @Response() res: ResponseEx
  ) {
    const data = await this.appService.getData(sellerSysId);
    const xlsx: ArrayBuffer = await this.xlsxService.generate(
      data.seller,
      data.products
    );

    res.set('Content-disposition', 'attachment; filename=biy_kz_service.xlsx');
    res.type(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.send(xlsx);
  }
}

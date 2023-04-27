import * as xl from 'excel4node';
import { Injectable } from '@nestjs/common';
import { ProductEntity, SellerEntity } from '@biy/database';

import { FileI } from './file.interface';

@Injectable()
export class XlsxService implements FileI {
  private rowsName: string[] = [
    'SKU',
    'model',
    'brand',
    'price',
    'PP1',
    'PP2',
    'PP3',
    'PP4',
    'PP5',
    'preorder',
  ];
  generate(
    seller: SellerEntity,
    productList: ProductEntity[]
  ): Promise<ArrayBuffer> {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Лист 1');
    for (let i = 0; i < 10; i++) {
      ws.cell(1, i + 1).string(this.rowsName[i]);
    }
    for (let i = 2; i < productList.length + 2; i++) {
      const product = productList[i - 2];
      ws.cell(i, 1).string(product.sku); //sku
      ws.cell(i, 2).string(product.name); //model
      ws.cell(i, 3).string(product.brand); //brand
      ws.cell(i, 4).number(product.rivalConfigs[0].price); //price
      for (let j = 0; j < 5; j++) {
        const currentPP = `PP${j + 1}`;
        const currentConfig = product.pointConfigs.filter(
          (config) => config.point.name === currentPP
        )[0];
        if (!currentConfig) {
          ws.cell(i, j + 5).string('');
          continue;
        }
        ws.cell(i, j + 5).string(currentConfig.available ? 'yes' : 'no');
      }
      const preorder = product.pointConfigs
        .map((r) => r.preOrder)
        .sort((a, b) => b - a)[0];
      ws.cell(i, 10).string(preorder > 0 ? preorder.toString() : '');
    }
    return wb.writeToBuffer();
  }
}

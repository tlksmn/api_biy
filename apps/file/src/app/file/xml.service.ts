import { Injectable } from '@nestjs/common';
import { ProductEntity, SellerEntity } from '@biy/database';
import { XMLBuilder, XmlBuilderOptionsOptional } from 'fast-xml-parser';

import { FileI } from './file.interface';

@Injectable()
export class XmlService implements FileI {
  private readonly xmlBuilder: XMLBuilder;
  private readonly options: XmlBuilderOptionsOptional = {
    attributeNamePrefix: '$',
    format: true,
    ignoreAttributes: false,
    suppressEmptyNode: false,
  };

  constructor() {
    this.xmlBuilder = new XMLBuilder(this.options);
  }

  generate(seller: SellerEntity, products: ProductEntity[]) {
    const xmlObj = {
      '?xml': {
        $version: '1.0',
        $encoding: 'utf-8',
      },
      kaspi_catalog: {
        $date: 'string',
        $xmlns: 'kaspiShopping',
        '$xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '$xsi:schemaLocation':
          'kaspiShopping http://kaspi.kz/kaspishopping.xsd',
        company: seller.username,
        merchantid: seller.sysId,
        offers: {
          offer: this.getProductsOfferList(seller, products),
        },
      },
    };
    return this.xmlBuilder.build(xmlObj);
  }

  private getProductsOfferList(
    seller: SellerEntity,
    products: ProductEntity[]
  ) {
    return products.map((product) => {
      const availability = product.pointConfigs
        .filter((e) => e.available)
        .map((config) => {
          const preorderObj =
            seller.user.activated &&
            seller.preOrderStatus &&
            config.preOrder > 0
              ? { $preOrder: config.preOrder }
              : {};

          return {
            $available: config.available ? 'yes' : 'no',
            $storeId: config.point.name,
            ...preorderObj,
          };
        });
      const cityPrices = product.rivalConfigs
        .filter((e) => e.pointConfigs?.some((e) => e.available))
        .map((config) => {
          return {
            $cityId: config.city.code,
            '#text': config.price,
          };
        });

      return {
        $sku: product.sku,
        model: product.name,
        brand: product.brand,
        availabilities: { availability: availability },
        cityprices: { cityprice: cityPrices },
      };
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProductEntity,
  RivalConfigEntity,
  SellerEntity,
  UserEntity,
} from '@biy/database';

import { CronI } from './cron.interface';
import { KaspiApi } from '../api/kaspi.api';

@Injectable()
export class RivalJob implements CronI {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(RivalConfigEntity)
    private readonly rivalConfigRepository: Repository<RivalConfigEntity>,
    private readonly kaspiApi: KaspiApi
  ) {}

  async handle() {
    let temp = 0;
    const sellers = await this.getSellers();
    for (const seller of sellers) {
      const rivalAcc: RivalConfigEntity[] = [];
      const products = await this.getProductList(seller.id);
      for (const product of products) {
        for (const rivalConfig of product.rivalConfigs) {
          try {
            const response = await this.kaspiApi.get(
              product,
              rivalConfig.city.code
            );
            temp++;
            rivalConfig.rivalSeller = response;
            const tempInFirstPrice = response.offers[0].price - 10;
            const minPrice = rivalConfig.minPrice;
            rivalConfig.price =
              tempInFirstPrice > rivalConfig.minPrice
                ? tempInFirstPrice - 5
                : minPrice + 100;
            rivalAcc.push(rivalConfig);
            //--todo
            // change price depends to min price
            //--todo
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      const partial = 30;
      for (let i = 0; i * partial < rivalAcc.length; i++) {
        try {
          const rivalPartial = rivalAcc.slice(i * partial, (i + 1) * partial);
          await this.rivalConfigRepository.save(rivalPartial);
        } catch (e) {
          Logger.log(e);
        }
      }
    }
    Logger.log(temp + ' fetch should be updated');
  }

  private getSellers() {
    return this.sellerRepository.find({
      where: { user: { activated: true } },
      relations: {
        user: true,
      },
    });
  }

  private getProductList(sellerId: number) {
    return this.productRepository.find({
      where: {
        rivalConfigs: {
          seller: { id: sellerId },
          pointConfigs: { available: true },
        },
      },
      relations: {
        rivalConfigs: {
          city: true,
        },
      },
    });
  }
}

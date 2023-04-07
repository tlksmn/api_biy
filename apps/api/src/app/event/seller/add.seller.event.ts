import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCountApiT, ResponseAPI, SellerApiT } from '@biy/api-type';
import { AddSellerDto, AddSellerEventPayload } from '@biy/dto';
import {
  CityEntity,
  PointConfigEntity,
  PointEntity,
  ProductCountEntity,
  ProductEntity,
  RivalConfigEntity,
  SellerEntity,
  StateE,
  UserEntity,
} from '@biy/database';

import { KaspiService } from '../../mp/kaspi/kaspi.service';
import { EventHandleI } from '../event.handle.interface';
import { ConfigService } from '@nestjs/config';
import { Rabbit } from 'crypto-js';

@Injectable()
export class AddSellerEvent implements EventHandleI {
  constructor(
    private readonly kaspiService: KaspiService,
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(PointConfigEntity)
    private readonly pointConfigRepository: Repository<PointConfigEntity>,
    @InjectRepository(PointEntity)
    private readonly pointRepository: Repository<PointEntity>,
    @InjectRepository(ProductCountEntity)
    private readonly productCountRepository: Repository<ProductCountEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(RivalConfigEntity)
    private readonly rivalConfigRepository: Repository<RivalConfigEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService
  ) {}

  async handle(payload: AddSellerEventPayload) {
    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const [seller, productCount] = await Promise.all([
      this.kaspiService.getSellerInfo({ token: payload.token }),
      this.kaspiService.getProductCount({ token: payload.token }),
    ]);

    const data = await this.saveSellerAndCount(
      seller,
      productCount,
      user,
      payload.data
    );

    const responseOffers = await this.kaspiService.getProductList(
      { token: payload.token },
      { limit: 1000 }
    );

    await this.saveList(responseOffers, data);
  }

  private async saveSellerAndCount(
    sellerResponse: SellerApiT,
    countResponse: ProductCountApiT,
    user: UserEntity,
    data: AddSellerDto
  ) {
    let seller = await this.sellerRepository.findOne({
      where: { sysId: sellerResponse.affiliateId },
    });
    if (seller)
      throw new HttpException('seller already defined', HttpStatus.BAD_REQUEST);

    const encryptedPassword = Rabbit.encrypt(
      data.password,
      this.configService.get('RABBIT_PASSWORD')
    ).toString();

    const sellerTemp = this.sellerRepository.create({
      email: sellerResponse.orderProcessingManager.email,
      fullName: `${sellerResponse.orderProcessingManager.name} | ${sellerResponse.orderProcessingManager.firstName} ${sellerResponse.orderProcessingManager.lastName}`,
      logoUrl: sellerResponse.logoUrl,
      phone: sellerResponse.orderProcessingManager.phone,
      password: encryptedPassword,
      sysId: sellerResponse.affiliateId,
      username: sellerResponse.name,
      user: { id: user.id },
    });
    seller = await this.sellerRepository.save(sellerTemp);

    const countTemp: ProductCountEntity = this.productCountRepository.create({
      expiringCount: countResponse.expiringCount,
      processingCount: countResponse.processingCount,
      activeCount: countResponse.activeCount,
      archiveCount: countResponse.archiveCount,
      seller: seller,
    });
    await this.productCountRepository.save(countTemp);

    const pointsAcc: PointEntity[] = [];
    for (const point of sellerResponse.pointOfServiceList) {
      const city = await this.cityRepository.findOneBy({
        name: point.cityName,
      });
      const newPoint = this.pointRepository.create({
        seller: seller,
        name: point.displayName,
        status: point.status,
        streetName: point.address.formattedAddress,
        city: city,
      });
      pointsAcc.push(newPoint);
    }
    const points = await this.pointRepository.save(pointsAcc);

    const getUniqueListBy = (arr, key) => {
      return [...new Map(arr.map((item) => [item[key], item])).values()];
    };
    const cities: CityEntity[] = points.map((e) => e.city);
    seller.cities = getUniqueListBy(cities, 'name') as CityEntity[];
    seller = await this.sellerRepository.save(seller);

    return { seller, cities, points };
  }

  private async saveList(
    response: ResponseAPI,
    data: {
      seller: SellerEntity;
      cities: CityEntity[];
      points: PointEntity[];
    }
  ) {
    const pointConfigArr: PointConfigEntity[] = [];
    for (const offer of response.offers) {
      let product = await this.productRepository.findOneBy({
        sku: offer.masterProduct.sku,
      });
      if (!product) {
        const productTemp = await this.productRepository.create({
          sku: offer.masterProduct.sku,
          name: offer.masterProduct.name,
          brand: offer.masterProduct.brand,
          url: offer.masterProduct.productUrl,
          image: offer.masterProduct.primaryImage.small,
        });
        product = await this.productRepository.save(productTemp);
      }
      for (const city of offer.cityInfo) {
        if (!city.pickupPoints || city.pickupPoints?.length < 0) {
          continue;
        }
        //--rival config definition--
        const currentCity = data.cities.filter((e) => e.name === city.name)[0];
        const rivalConfigTemp = this.rivalConfigRepository.create({
          seller: data.seller,
          city: currentCity,
          product: product,
          rivalSeller: {},
          price:
            city?.priceRow?.price || offer?.priceMin || offer?.priceMax || 0,
        });
        const rival = await this.rivalConfigRepository.save(rivalConfigTemp);
        //--rival config definition--

        for (const point of city.pickupPoints) {
          //--point config definition
          const currentPoint = data.points.filter(
            (e) => e.name === point.displayName
          )[0];
          const pointConfigTemp = this.pointConfigRepository.create({
            seller: data.seller,
            product: product,
            point: currentPoint,
            city: currentCity,
            available: offer.offerStatus === StateE.ACTIVE && point.available,
            rivalConfig: rival,
            status:
              offer.offerStatus === StateE.ACTIVE
                ? offer.offerStatus
                : point.status,
          });
          //--point config definition
          pointConfigArr.push(pointConfigTemp);
        }
      }
    }
    const pointConfigArrLength = pointConfigArr.length;
    const partial = 600;
    for (let index = 0; index * partial < pointConfigArrLength; index++) {
      const partPointConfigArr = pointConfigArr.slice(
        index * partial,
        (index + 1) * partial
      );
      await this.pointConfigRepository.save(partPointConfigArr);
    }
  }
}

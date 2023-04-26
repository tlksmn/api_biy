import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventHandleI } from '../event.handle.interface';
import { AddSellerDto, ReintegrateSellerEventPayload } from '@biy/dto';
import { KaspiService } from '../../mp/kaspi/kaspi.service';
import { InjectRepository } from '@nestjs/typeorm';
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
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ProductCountApiT, ResponseAPI, SellerApiT } from '@biy/api-type';
import { Rabbit } from 'crypto-js';

@Injectable()
export class ReintegrateSellerEvent implements EventHandleI {
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

  async handle(data: ReintegrateSellerEventPayload) {
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const [seller, productCount] = await Promise.all([
      this.kaspiService.getSellerInfo({ token: data.token }),
      this.kaspiService.getProductCount({ token: data.token }),
    ]);
    const temp = await this.updateSellerAndCount(
      seller,
      productCount,
      user,
      data.data
    );

    const responseOffers = await this.kaspiService.getProductList(
      { token: data.token },
      { limit: 1000 }
    );

    await this.saveList(responseOffers, temp);
  }

  async updateSellerAndCount(
    sellerResponse: SellerApiT,
    countResponse: ProductCountApiT,
    user: UserEntity,
    data: AddSellerDto
  ) {
    let seller = await this.sellerRepository.findOne({
      where: { sysId: sellerResponse.affiliateId },
    });
    if (!seller)
      throw new HttpException('seller not found', HttpStatus.NOT_FOUND);
    const encryptedPassword = Rabbit.encrypt(
      data.password,
      this.configService.get('RABBIT_PASSWORD')
    ).toString();

    const sellerTemp = this.sellerRepository.create({
      email: data.email,
      fullName: `${sellerResponse.orderProcessingManager.name} | ${sellerResponse.orderProcessingManager.firstName} ${sellerResponse.orderProcessingManager.lastName}`,
      logoUrl: sellerResponse.logoUrl,
      phone: sellerResponse.orderProcessingManager.phone,
      password: encryptedPassword,
      sysId: sellerResponse.affiliateId,
      username: sellerResponse.name,
      user: { id: user.id },
      id: seller.id,
    });
    seller = await this.sellerRepository.save(sellerTemp);
    const countSeller = await this.productCountRepository.findOne({
      where: { seller: { id: seller.id } },
    });
    const countTemp: ProductCountEntity = this.productCountRepository.create({
      expiringCount: countResponse.expiringCount,
      processingCount: countResponse.processingCount,
      activeCount: countResponse.activeCount,
      archiveCount: countResponse.archiveCount,
      id: countSeller.id,
    });
    await this.productCountRepository.save(countTemp);

    const pointsAcc: PointEntity[] = [];

    for (const point of sellerResponse.pointOfServiceList) {
      const city = await this.cityRepository.findOneBy({
        name: point.cityName,
      });
      let pointAcc = await this.pointRepository.findOne({
        where: {
          name: point.displayName,
          seller: {
            id: seller.id,
          },
        },
      });
      pointAcc = this.pointRepository.create({
        name: point.displayName,
        status: point.status,
        streetName: point.address.formattedAddress,
        city: city,
        id: pointAcc.id,
      });
      pointsAcc.push(pointAcc);
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

  async saveList(
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
        product = await this.productRepository.create({
          sku: offer.masterProduct.sku,
          name: offer.masterProduct.name,
          brand: offer.masterProduct.brand,
          url: offer.masterProduct.productUrl,
          image: offer.masterProduct.primaryImage.small,
        });
      }
      product = await this.productRepository.save(product);
      for (const city of offer.cityInfo) {
        if (!city.pickupPoints || city.pickupPoints?.length < 0) {
          continue;
        }
        const currentCity = data.cities.filter((e) => e.name === city.name)[0];
        if (!currentCity) {
          continue;
        }
        let rivalConfigTemp = await this.rivalConfigRepository.findOne({
          where: {
            seller: {
              id: data.seller.id,
            },
            city: {
              id: currentCity.id,
            },
            product: {
              id: product.id,
            },
          },
        });
        if (!rivalConfigTemp) {
          rivalConfigTemp = this.rivalConfigRepository.create({
            seller: data.seller,
            city: currentCity,
            product: product,
            rivalSeller: {},
          });
        }
        rivalConfigTemp.price =
          city?.priceRow?.price || offer?.priceMin || offer?.priceMax || 0;
        const rival = await this.rivalConfigRepository.save(rivalConfigTemp);
        for (const point of city.pickupPoints) {
          const currentPoint = data.points.filter(
            (e) => e.name === point.displayName
          )[0];
          if (!currentPoint) {
            continue;
          }
          let pointConfigTemp = await this.pointConfigRepository.findOne({
            where: {
              seller: {
                id: data.seller.id,
              },
              product: {
                id: product.id,
              },
              point: {
                id: currentPoint.id,
              },
              city: {
                id: currentCity.id,
              },
              rivalConfig: {
                id: rivalConfigTemp.id,
              },
            },
          });
          if (!pointConfigTemp) {
            pointConfigTemp = this.pointConfigRepository.create({
              seller: data.seller,
              product: product,
              point: currentPoint,
              city: currentCity,
              rivalConfig: rival,
            });
          }
          point.available =
            offer.offerStatus === StateE.ACTIVE && point.available;
          point.status =
            offer.offerStatus === StateE.ACTIVE
              ? offer.offerStatus
              : point.status;
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
    console.log('completed' + pointConfigArrLength);
  }
}

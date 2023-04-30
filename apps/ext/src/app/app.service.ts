import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RivalConfigEntity, SellerEntity, UserEntity } from '@biy/database';
import { Repository } from 'typeorm';
import { ActivateDto, UpdateRivalDto } from '@biy/dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(RivalConfigEntity)
    private readonly rivalConfigRepository: Repository<RivalConfigEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async getRivalConfig(sellerId: string) {
    const response = await this.rivalConfigRepository.findAndCount({
      where: {
        pointConfigs: { available: true },
        seller: { sysId: sellerId },
      },
      select: {
        id: true,
        city: {
          code: true,
        },
        product: {
          sku: true,
        },
      },
      relations: {
        city: true,
        product: true,
      },
      order: {
        id: 'asc',
      },
    });
    return { total: response[1], list: response[0] };
  }

  async activate(data: ActivateDto) {
    const user = await this.userRepository.find({
      where: { hash: data.hash, activated: true },
      relations: { sellers: true },
      select: {
        id: true,
        name: true,
        activated: true,
        sellers: {
          id: true,
          sysId: true,
          username: true,
        },
      },
    });
    if (user.length === 0)
      throw new HttpException('invalid data sent) 042', HttpStatus.BAD_REQUEST);

    return user[0];
  }

  async updateRival(payload: UpdateRivalDto) {
    if (
      payload.data.total < 1 ||
      payload.data.offers.length === 0 ||
      payload.data.offersCount < 1
    ) {
      throw new HttpException('x_X', HttpStatus.BAD_REQUEST);
    }
    let rival = await this.rivalConfigRepository.findOne({
      where: {
        seller: { id: payload.sellerId, user: { hash: payload.hash } },
        id: payload.id,
      },
      relations: { seller: { user: true } },
    });
    if (!rival || !rival.seller) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    const seller = rival.seller;
    //---todo---
    //Price manipulation
    const minPrice = rival.minPrice || 0;
    const priceAcc = payload.data.offers;
    const priceAccThisSeller = priceAcc.filter(
      (e) => e.merchantId === rival.seller.sysId
    )[0];
    const oldPrice = priceAccThisSeller?.price || rival.price;

    if (minPrice === 0) {
      if (seller.sysId === priceAcc[0].merchantId) {
        rival.price = priceAcc[1]?.price - 2 || oldPrice + 2;
      } else if (seller.sysId === priceAcc[1].merchantId) {
        rival.price = priceAcc[0].price - 2;
      } else if (seller.sysId === priceAcc[2].merchantId) {
        rival.price = priceAcc[0].price - 2;
      } else {
        rival.price = priceAcc[0].price - 2;
      }
    } else {
      if (priceAccThisSeller) {
        rival.price = priceAcc[1].price - 2;
      } else if (minPrice < priceAcc[0].price) {
        rival.price = priceAcc[0].price - 2;
      } else if (minPrice < priceAcc[1].price) {
        rival.price = priceAcc[1].price - 2;
      } else if (minPrice < priceAcc[2].price) {
        rival.price = priceAcc[2].price - 2;
      } else if (minPrice < priceAcc[3].price) {
        rival.price = priceAcc[3].price - 2;
      } else if (minPrice < priceAcc[4].price) {
        rival.price = priceAcc[4].price - 2;
      } else {
        rival.price = rival.minPrice + 2;
      }
    }
    rival.oldPrice = oldPrice;
    rival.rivalSeller = payload.data;
    rival = await this.rivalConfigRepository.save(rival);
    return { message: 'ok' };
    //Price manipulation
    //---todo---
  }
}

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
    const rival = await this.rivalConfigRepository.findOne({
      where: {
        seller: { id: payload.sellerId, user: { hash: payload.hash } },
        id: payload.id,
      },
      relations: { seller: true },
    });
    if (!rival || !rival.seller) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }

    //---todo---
    //Price manipulation
    const thisSeller = rival.seller;
    const firstSeller = payload.data.offers[0];
    const secondSeller = payload.data.offers[1];
    const thirdSeller = payload.data.offers[1];
    const currentSeller = payload.data.offers.filter(
      (e) => e.merchantId === rival.seller.sysId
    )[0];
    rival.rivalSeller = payload.data;

    if (firstSeller || secondSeller || thirdSeller) {
      rival.oldPrice = currentSeller?.price || rival.price;
      if (firstSeller?.merchantId !== thisSeller.sysId) {
        rival.price = firstSeller.price - 2;
        return this.rivalConfigRepository.save(rival);
      } else if (firstSeller?.merchantId === thisSeller.sysId) {
        rival.price = secondSeller.price - 2;
        return this.rivalConfigRepository.save(rival);
      } else if (secondSeller?.merchantId === thisSeller.sysId) {
        rival.price = firstSeller.price - 2;
        return this.rivalConfigRepository.save(rival);
      } else if (thirdSeller?.merchantId === thisSeller.sysId) {
        rival.price = secondSeller?.price - 2;
        return this.rivalConfigRepository.save(rival);
      }
    }

    const newPrice = firstSeller.price - 2;
    if (rival.minPrice > 0) {
      rival.price = newPrice < rival.minPrice ? newPrice : rival.minPrice + 100;
    } else {
      rival.price = secondSeller.price - 2;
    }
    return this.rivalConfigRepository.save(rival);

    //---todo---
  }
}

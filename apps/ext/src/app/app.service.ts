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
      throw new HttpException('invalid', HttpStatus.BAD_REQUEST);

    return user[0];
  }

  async updateRival(payload: UpdateRivalDto) {
    const rival = await this.rivalConfigRepository.findOne({
      where: {
        seller: { id: payload.sellerId, user: { hash: payload.hash } },
        id: payload.id,
      },
    });
    if (!rival) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    rival.rivalSeller = payload.data;
    return this.rivalConfigRepository.save(rival);
  }
}

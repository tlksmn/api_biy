import { Repository } from 'typeorm';
import { SellerEntity, UserEntity } from '@biy/database';
import { InjectRepository } from '@nestjs/typeorm';
import { AddSellerDto, EventRoute, UpdateSellerDto } from '@biy/dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { KaspiService } from '../../mp/kaspi/kaspi.service';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    private readonly kaspiService: KaspiService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async addSeller(data: AddSellerDto, user: UserEntity) {
    const seller = await this.sellerRepository.findOne({
      where: { email: data.email },
    });
    if (seller)
      throw new HttpException(
        'seller defined already',
        HttpStatus.NOT_ACCEPTABLE
      );

    const token: string = await this.kaspiService.login(data);
    this.eventEmitter.emit(EventRoute.addSeller, {
      token,
      userId: user.id,
      data,
    });
    return true;
  }

  getList(user: UserEntity) {
    return this.sellerRepository.find({ where: { user: { id: user.id } } });
  }

  getById(id: number, user: UserEntity) {
    return this.sellerRepository.findOne({
      where: { id: id, user: { id: user.id } },
      relations: { cities: true, count: true, points: true },
      order: { id: 'asc', cities: { id: 'asc' }, points: { id: 'asc' } },
    });
  }
  async update(data: UpdateSellerDto, user: UserEntity) {
    const seller = await this.sellerRepository.findOne({
      where: { id: data.id, user: { id: user.id } },
    });
    if (!seller) {
      throw new HttpException('not acceptable', HttpStatus.NOT_ACCEPTABLE);
    }
    Object.assign(seller, data);
    return this.sellerRepository.save(seller);
  }
}

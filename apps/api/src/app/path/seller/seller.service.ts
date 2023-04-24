import { Repository } from 'typeorm';
import { SellerEntity, UserEntity } from '@biy/database';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AddSellerDto,
  AddSellerEventPayload,
  EventRoute,
  ReintegrateDto,
  ReintegrateSellerEventPayload,
  UpdateSellerDto,
} from '@biy/dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Rabbit } from 'crypto-js';
import CryptoJS = require('crypto-js/core');
import { ConfigService } from '@nestjs/config';

import { KaspiService } from '../../mp/kaspi/kaspi.service';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    private readonly kaspiService: KaspiService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService
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
    const payload: AddSellerEventPayload = {
      token,
      userId: user.id,
      data,
    };
    this.eventEmitter.emit(EventRoute.addSeller, payload);
    return true;
  }

  async getList(user: UserEntity) {
    const response = await this.sellerRepository.findAndCount({
      where: { user: { id: user.id } },
      relations: { cities: true, count: true, points: true },
      order: { id: 'ASC' },
    });
    return { total: response[1], list: response[0] };
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

  async reintegrate(user: UserEntity, data: ReintegrateDto) {
    const seller = await this.sellerRepository.findOne({
      where: {
        id: data.sellerId,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    if (!seller) {
      throw new HttpException('seller not found', HttpStatus.NOT_FOUND);
    }
    const password = Rabbit.decrypt(
      seller.password,
      this.configService.get('RABBIT_PASSWORD')
    ).toString(CryptoJS.enc.Utf8);

    const token: string = await this.kaspiService.login({
      email: seller.email,
      password,
    });

    const payload: ReintegrateSellerEventPayload = {
      token: token,
      userId: user.id,
      userEmail: user.email,
      sellerId: seller.id,
      data: {
        password: password,
        email: seller.email,
      },
    };

    this.eventEmitter.emit(EventRoute.reintegrateSeller, payload);

    return {
      message: 'reintegration has been started',
    };
  }

  async delete(user: UserEntity, sellerId: number) {
    const seller = await this.sellerRepository.findOne({
      where: {
        id: sellerId,
        user: { id: user.id },
      },
    });
    if (!seller) {
      throw new HttpException('seller not found', HttpStatus.NOT_FOUND);
    }
    await this.sellerRepository.remove(seller);
    return {
      message: 'ok',
    };
  }
}

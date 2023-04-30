import { OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { CityEntity, cityListConstants } from '@biy/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  AddSellerEventPayload,
  EventRoute,
  ReintegrateSellerEventPayload,
  UpdateSellerEventPayload,
} from '@biy/dto';

import { AddSellerEvent } from './add.seller.event';
import { UpdateSellerEvent } from './update.seller.event';
import { ReintegrateSellerEvent } from './reintegrate.seller.event';

@Injectable()
export class MainSellerEvent implements OnModuleInit {
  constructor(
    private readonly addSellerEvent: AddSellerEvent,
    private readonly updateSellerEvent: UpdateSellerEvent,
    private readonly reintegrateSellerEvent: ReintegrateSellerEvent,
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>
  ) {}

  async onModuleInit(): Promise<void> {
    const cityCount = await this.cityRepository.count();
    if (cityCount > 50) {
      return;
    }
    const cityListConstantsLength = cityListConstants.length;
    const partial = 30;
    for (let i = 0; i * partial < cityListConstantsLength; i++) {
      try {
        const cityListPartial = cityListConstants.slice(
          i * partial,
          (i + 1) * partial
        );
        await this.cityRepository.save(
          cityListPartial.map((e) =>
            this.cityRepository.create({
              name: e.cityRus,
              code: e.id,
            })
          )
        );
      } catch (e) {
        console.log(e);
      }
    }
    Logger.log('city $seed created#');
  }

  @OnEvent(EventRoute.addSeller)
  async addSeller(payload: AddSellerEventPayload) {
    try {
      await this.addSellerEvent.handle(payload);
    } catch (e) {
      console.log(e);
    }
    Logger.log(
      `ADD_SELLER_EVENT seller=${payload.data.email}#=${payload.data.password} user_id=${payload.userId}`
    );
  }

  @OnEvent(EventRoute.updateSeller)
  async updateSeller(payload: UpdateSellerEventPayload) {
    await this.updateSellerEvent.handle(payload);
    Logger.log(
      `UPDATE_SELLER_EVENT seller=${payload.data.email}#=${payload.data.password} user_id=${payload.userId}`
    );
    //--todo--
  }

  @OnEvent(EventRoute.reintegrateSeller)
  async reintegrateSeller(payload: ReintegrateSellerEventPayload) {
    try {
      await this.reintegrateSellerEvent.handle(payload);
    } catch (e) {
      console.log(e);
    }
    Logger.log(
      `RE_INTEGRATE_SELLER_EVENT seller=${payload.data.email}#=${payload.data.password} user_id=${payload.userId}`
    );
  }
}

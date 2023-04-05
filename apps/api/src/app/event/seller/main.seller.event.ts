import { OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { CityEntity, cityListConstants } from '@biy/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  AddSellerEventPayload,
  EventRoute,
  UpdateSellerEventPayload,
} from '@biy/dto';

import { AddSellerEvent } from './add.seller.event';
import { UpdateSellerEvent } from './update.seller.event';

@Injectable()
export class MainSellerEvent implements OnModuleInit {
  constructor(
    private readonly addSellerEvent: AddSellerEvent,
    private readonly updateSellerEvent: UpdateSellerEvent,
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
    console.log('city $seed created#');
  }

  @OnEvent(EventRoute.addSeller)
  async addSeller(payload: AddSellerEventPayload) {
    try {
      await this.addSellerEvent.handle(payload);
    } catch (e) {
      console.log(e);
    }
    console.log('completed!');
  }

  @OnEvent(EventRoute.updateSeller)
  updateSeller(payload: UpdateSellerEventPayload) {
    return this.updateSellerEvent.handle(payload);
  }
}

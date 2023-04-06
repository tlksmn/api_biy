import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { PriceListApiT } from '@biy/api-type';
import { ProxyService } from '../proxy/proxy.service';

@Injectable()
export class KaspiApi {
  constructor(private readonly proxyService: ProxyService) {}
  async get(productId: number, cityId: number) {
    const request = await fetch(
      `https://kaspi.kz/yml/offer-view/offers/${productId}`,
      {
        timeout: 8_000,
        method: 'post',
        body: JSON.stringify({
          cityId: cityId,
          id: +productId,
          merchantUID: '',
          limit: 10,
          page: 0,
          sort: true,
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        // -- todo -- fetch proxy rotator
        // --!--
        // -- todo --
      }
    );
    return (await request.json()) as Promise<PriceListApiT>;
  }
  async getFoo(productId: number, cityId: number) {
    await new Promise((resolve) => resolve(-1));
    return {
      total: Math.ceil(Math.random() * 10_000),
      offers: [],
      offersCount: Math.ceil(Math.random() * 10_000),
      deliveryDurationFacetValues: null,
    } as PriceListApiT;
  }
}

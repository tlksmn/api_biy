import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { PriceListApiT } from '@biy/api-type';
import { ProxyService } from '../proxy/proxy.service';

@Injectable()
export class KaspiApi {
  constructor(private readonly proxyService: ProxyService) {}

  async get(productId: number, cityId: number) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(0);
      }, 1_000);
    });

    const request = await fetch(
      `https://kaspi.kz/yml/offer-view/offers/${productId}`,
      {
        timeout: 8_000,
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Accept: 'application/json, text/*',
          Origin: 'https://kaspi.kz',
          Referer: `https://kaspi.kz/shop/p/hiuf-${productId}/?c=${cityId}`,
          Cookie: `k_stat=c1594452-2b56-49b0-b8af-e893477e599e; ks.tg=97; ssaid=1300c5a0-ba6e-11ed-adb3-e73e2d14dead; kaspi.storefront.cookie.city=750000000; ks.cc=-1; amp_6e9c16=V-sbMIIDGZFz6d_NzsO539...1gshetkq2.1gshfs5c9.bg.0.bg; ks.ngs.s=149be56b08bbd516ee473c4966966420; __tld__=null`,
        },
        body: JSON.stringify({
          cityId: cityId.toString(),
          id: productId.toString(),
          merchantUID: '',
          limit: 10,
          page: 0,
          sort: true,
        }),
        agent: this.proxyService.getNext(),
      }
    );
    console.log(await request.text());
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

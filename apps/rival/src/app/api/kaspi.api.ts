import { Injectable } from '@nestjs/common';
import { PriceListApiT } from '@biy/api-type';
import { ProxyService } from '../proxy/proxy.service';
import axios from 'axios';
import { ProductEntity } from '@biy/database';

@Injectable()
export class KaspiApi {
  constructor(private readonly proxyService: ProxyService) {}

  async get(product: ProductEntity, cityId: number) {
    const data = {
      cityId: cityId,
      id: product.sku,
      merchantUID: '',
      installationId: -1,
      limit: 10,
      page: 0,
      sort: true,
      product: {
        baseProductCodes: [],
        brand: product.brand,
        categoryCodes: [],
        groups: [],
      },
      zoneId: 'Magnum_ZONE1',
    };
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://kaspi.kz/yml/offer-view/offers/${product.sku}/`,
      headers: {
        Accept: 'application/json, text/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json; charset=UTF-8',
        Connection: 'keep-alive',
        Origin: 'https://kaspi.kz',
        Referer: product.url + '?c=' + cityId,
        Cookie:
          'k_stat=c1594452-2b56-49b0-b8af-e893477e599e; ks.tg=97; ssaid=1300c5a0-ba6e-11ed-adb3-e73e2d14dead; kaspi.storefront.cookie.city=750000000; ks.cc=-1; amp_6e9c16=V-sbMIIDGZFz6d_NzsO539...1gtr92sq9.1gtra9svk.bn.0.bn; ks.ngs.s=e633617833b29aed2e06a1bb5b0d3d82; __tld__=null',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        'sec-ch-ua':
          '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
      agent: this.proxyService.getNext(),
      data: data,
    };
    const request = await axios.request<PriceListApiT>(config);
    return request.data;
  }
}

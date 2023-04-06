import { Injectable } from '@nestjs/common';
import { PriceListApiT } from '@biy/api-type';
import { ProxyService } from '../proxy/proxy.service';
import axios from 'axios';

@Injectable()
export class KaspiApi {
  constructor(private readonly proxyService: ProxyService) {}

  async get(productId: number, cityId: number, productName: string) {
    const data = JSON.stringify({
      cityId: cityId,
      id: productId,
      merchantUID: '',
      limit: 10,
      page: 0,
      sort: true,
    });
    const translated = this.transliterate(productName).toLowerCase();
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://kaspi.kz/yml/offer-view/offers/${productId}`,
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Content-Type': 'application/json; charset=UTF-8',
        Origin: 'https://kaspi.kz',
        Referer: `https://kaspi.kz/shop/p/${translated}-${productId}/?c=${cityId}`,
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        'sec-ch-ua':
          '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
      agent: this.proxyService.getNext(),
      data: data,
    };
    const request = await axios.request<PriceListApiT>(config);
    return request.data;
  }

  private transliterate(word): string {
    const a = {
      Ё: 'YO',
      Й: 'I',
      Ц: 'TS',
      У: 'U',
      К: 'K',
      Е: 'E',
      Н: 'N',
      Г: 'G',
      Ш: 'SH',
      Щ: 'SCH',
      З: 'Z',
      Х: 'H',
      Ъ: "'",
      ё: 'yo',
      й: 'i',
      ц: 'ts',
      у: 'u',
      к: 'k',
      е: 'e',
      н: 'n',
      г: 'g',
      ш: 'sh',
      щ: 'sch',
      з: 'z',
      х: 'h',
      ъ: "'",
      Ф: 'F',
      Ы: 'I',
      В: 'V',
      А: 'A',
      П: 'P',
      Р: 'R',
      О: 'O',
      Л: 'L',
      Д: 'D',
      Ж: 'ZH',
      Э: 'E',
      ф: 'f',
      ы: 'i',
      в: 'v',
      а: 'a',
      п: 'p',
      р: 'r',
      о: 'o',
      л: 'l',
      д: 'd',
      ж: 'zh',
      э: 'e',
      Я: 'Ya',
      Ч: 'CH',
      С: 'S',
      М: 'M',
      И: 'I',
      Т: 'T',
      Ь: "'",
      Б: 'B',
      Ю: 'YU',
      я: 'ya',
      ч: 'ch',
      с: 's',
      м: 'm',
      и: 'i',
      т: 't',
      ь: "'",
      б: 'b',
      ю: 'yu',
      ' ': '_',
    };
    return word
      .split('')
      .map(function (char) {
        return a[char] || char;
      })
      .join('');
  }
}

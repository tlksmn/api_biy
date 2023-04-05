import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddSellerDto } from '@biy/dto';
import {
  ApiListDto,
  PriceListApiT,
  ProductCountApiT,
  ResponseAPI,
  SellerApiT,
  TokenDto,
} from '@biy/api-type';

@Injectable()
export class KaspiService {
  async login(data: AddSellerDto) {
    const request = await fetch('https://kaspi.kz/mc/api/login', {
      body: `username=${data.email}&password=${data.password}`,
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Origin: 'https://kaspi.kz',
        Referer: 'https://kaspi.kz/mc/',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
      },
    });
    if (request.status === 200 || request.status === 201) {
      return this.parseSetCookie(request.headers.get('set-cookie'));
    } else {
      throw new HttpException(
        'password or email are incorrect',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async getSellerInfo(data: TokenDto): Promise<SellerApiT> {
    const request = await fetch(
      'https://kaspi.kz/merchantcabinet/api/merchant/settings',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
          Origin: 'https://kaspi.kz',
          Referer: 'https://kaspi.kz/mc/',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          Cookie: data.token,
        },
      }
    );
    this.throws(request);
    return (await request.json()) as Promise<SellerApiT>;
  }

  async getProductList(
    headers: TokenDto,
    data: ApiListDto
  ): Promise<ResponseAPI> {
    const request = await fetch('https://kaspi.kz/merchantcabinet/api/offer/', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        Origin: 'https://kaspi.kz',
        Referer: 'https://kaspi.kz/mc/',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Cookie: headers.token,
      },
      body: JSON.stringify({
        categoryCode: null,
        cityId: data.cityId || null,
        count: data.limit || 2000,
        offerStatus: data.status,
        searchTerm: null,
        start: data.start || 0,
      }),
    });
    this.throws(request);
    return (await request.json()) as Promise<ResponseAPI>;
  }

  async getProductCount(data: TokenDto): Promise<ProductCountApiT> {
    const request = await fetch('https://kaspi.kz/merchantcabinet/api/offer/', {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        Origin: 'https://kaspi.kz',
        Referer: 'https://kaspi.kz/mc/',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Cookie: data.token,
      },
    });
    this.throws(request);
    return (await request.json()) as Promise<ProductCountApiT>;
  }

  //proxy === rivals
  async getPriceList(productId: number, cityIndex: number) {
    const request = await fetch(
      `https://kaspi.kz/yml/offer-view/offers/${productId}`,
      {
        method: 'post',
        body: JSON.stringify({
          cityId: cityIndex,
          id: productId,
          merchantUID: '',
          limit: 10,
          page: 0,
          sort: true,
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      }
    );
    return (await request.json()) as Promise<PriceListApiT>;
  }
  //proxy === rivals

  private parseSetCookie(cookie: string): string {
    const cookiesSetArray: string[] = cookie.split('=/, ');
    const cookies = cookiesSetArray.map((e) => {
      return e.split('; ')[0];
    });
    return cookies.join('; ');
  }

  private throws(request: Response): never | boolean {
    if (request.status > 299) {
      throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
    } else {
      return true;
    }
  }
}

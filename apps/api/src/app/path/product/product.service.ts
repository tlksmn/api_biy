import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity, SellerEntity, UserEntity } from '@biy/database';
import { Repository } from 'typeorm';
import { ProductGetDto } from '@biy/dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>
  ) {}

  async getList(user: UserEntity, data: ProductGetDto) {
    const take = data.take || 10;
    const page = data.page || 1;

    const available =
      data.available?.length > 0
        ? data.available === 'true'
          ? { pointConfigs: { available: true } }
          : { pointConfigs: { available: false } }
        : {};

    const seller = await this.sellerRepository.findOne({
      where: { id: data.sellerId, user: { id: user.id } },
    });
    if (!seller) {
      throw new HttpException('not acceptable', HttpStatus.NOT_ACCEPTABLE);
    }
    const response = await this.productRepository.findAndCount({
      where: {
        rivalConfigs: { seller: { id: seller.id } },
        ...available,
      },
      relations: {
        rivalConfigs: { city: true, pointConfigs: { point: true } },
      },
      take: take,
      skip: (page - 1) * take,
      order: {
        id: 'asc',
      },
    });
    return { page, take, total: response[1], list: response[0] };
  }
}

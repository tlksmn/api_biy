import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity, UserEntity } from '@biy/database';
import { Repository } from 'typeorm';
import { ProductGetDto } from '@biy/dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async getList(user: UserEntity, data: ProductGetDto) {
    const take = +data.take || 10;
    const page = +data.page || 1;
    const available =
      data.available?.length > 0
        ? data.available === 'true'
          ? { pointConfigs: { available: true } }
          : { pointConfigs: { available: false } }
        : {};

    const products = await this.productRepository.findAndCount({
      where: { rivalConfigs: { seller: { id: data.sellerId }, ...available } },
      relations: {
        rivalConfigs: { city: true, pointConfigs: { point: true } },
      },
      take: take,
      skip: (page - 1) * take,
      order: {
        id: 'asc',
        rivalConfigs: {
          id: 'asc',
          pointConfigs: {
            id: 'asc',
          },
        },
      },
    });
    return {
      page: page,
      take: take,
      total: products[1],
      list: products[0],
    };
  }
}

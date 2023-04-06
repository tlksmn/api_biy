import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity, SellerEntity } from '@biy/database';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>
  ) {}

  async getData(
    sellerSysId: string
  ): Promise<{ products: ProductEntity[]; seller: SellerEntity }> {
    const seller = await this.sellerRepository.findOne({
      where: { sysId: sellerSysId },
      relations: { user: true },
    });

    if (!seller) {
      throw new HttpException('продавец не существет', HttpStatus.NOT_FOUND);
    }

    const products = await this.productRepository.find({
      where: { rivalConfigs: { seller: { id: seller.id } } },
      relations: {
        rivalConfigs: { city: true },
        pointConfigs: { point: true },
      },
    });
    return { seller, products };
  }
}

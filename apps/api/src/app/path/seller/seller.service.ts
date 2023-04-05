import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SellerEntity, UserEntity } from '@biy/database';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSellerDto } from '@biy/dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>
  ) {}

  getList(user: UserEntity) {
    return this.sellerRepository.find({ where: { user: { id: user.id } } });
  }

  getById(id: number, user: UserEntity) {
    return this.sellerRepository.findOne({
      where: { id: id, user: { id: user.id } },
    });
  }
  async update(data: UpdateSellerDto, user: UserEntity) {
    const seller = await this.sellerRepository.findOne({
      where: { id: data.id, user: { id: user.id } },
    });
    if (!seller) {
      throw new HttpException('not acceptable', HttpStatus.NOT_ACCEPTABLE);
    }
    Object.assign(seller, data);
    return this.sellerRepository.save(seller);
  }
}

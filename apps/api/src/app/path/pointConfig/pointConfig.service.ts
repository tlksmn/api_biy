import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointConfigEntity, UserEntity } from '@biy/database';
import { UpdatePointConfigDto } from '@biy/dto';

@Injectable()
export class PointConfigService {
  constructor(
    @InjectRepository(PointConfigEntity)
    private readonly pointConfigRepository: Repository<PointConfigEntity>
  ) {}

  async update(data: UpdatePointConfigDto, user: UserEntity) {
    const point = await this.pointConfigRepository.findOne({
      where: { seller: { user: { id: user.id } } },
    });
    if (!point) {
      throw new HttpException('not acceptable', HttpStatus.NOT_ACCEPTABLE);
    }
    Object.assign(point, data);
    return this.pointConfigRepository.save(point);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RivalConfigEntity, UserEntity } from '@biy/database';
import { Repository } from 'typeorm';
import { UpdateRivalConfigDto } from '@biy/dto';

@Injectable()
export class RivalConfigService {
  constructor(
    @InjectRepository(RivalConfigEntity)
    private readonly rivalConfigRepository: Repository<RivalConfigEntity>
  ) {}

  async update(data: UpdateRivalConfigDto, user: UserEntity) {
    const rivalConfig = await this.rivalConfigRepository.findOne({
      where: { seller: { user: { id: user.id } } },
    });
    if (!rivalConfig) {
      throw new HttpException('not acceptable', HttpStatus.NOT_ACCEPTABLE);
    }
    Object.assign(rivalConfig, data);
    return this.rivalConfigRepository.save(rivalConfig);
  }
}

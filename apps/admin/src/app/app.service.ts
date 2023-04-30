import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@biy/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteUserDto, UpdateUserDto } from '@biy/dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async getUserList() {
    const data = await this.userRepository.findAndCount({
      relations: { sellers: { count: true, points: true, cities: true } },
      order: { id: 'asc' },
      select: {
        id: true,
        name: true,
        sellers: true,
        accessed: true,
        phone: true,
        email: true,
        created: true,
        updated: true,
        activated: true,
      },
    });
    return { total: data[1], list: data[0] };
  }

  async updateUser(data: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: data.id } });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const updatedUser = Object.assign(user, data);
    const response = await this.userRepository.save(updatedUser);
    delete response.password;
    return response;
  }

  async deleteUser(data: DeleteUserDto) {
    const user = await this.userRepository.findOne({ where: { id: data.id } });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.remove(user);
    return { message: 'deleted' };
  }
}

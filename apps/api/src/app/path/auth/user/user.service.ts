import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@biy/database';
import { Repository } from 'typeorm';
import { SignUpDto } from '@biy/dto';
import { v4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  getById(id: number) {
    return this.userRepository.findOne({ where: { id: id } });
  }

  getByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async createUser(user: SignUpDto) {
    const oldUser = await this.userRepository.findOne({
      where: [{ email: user.email }, { phone: user.phone }],
    });
    if (oldUser) {
      throw new HttpException('user already exists', HttpStatus.NOT_ACCEPTABLE);
    }
    const newUser = this.userRepository.create({
      email: user.email,
      name: user.name,
      phone: user.phone,
      password: user.password,
      hash: `biy_ext:${v4() as string}`,
    });
    return this.userRepository.save(newUser);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { JwtPayload, SignUpDto } from '@biy/dto';
import { UserEntity } from '@biy/database';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async signUp(data: SignUpDto) {
    const user = await this.userService.createUser(data);
    delete user.password;
    return user;
  }

  public async authenticateUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new HttpException(
        'password or email invalid',
        HttpStatus.BAD_REQUEST
      );
    }
    await this.comparePassword(password, user.password);
    delete user.password;
    return user;
  }

  public getCookie(userId: number) {
    const payload: JwtPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME'
    )}`;
  }

  private async comparePassword(current: string, hash: string) {
    const validationValue = await UserEntity.checkPassword(current, hash);
    if (!validationValue) {
      throw new HttpException(
        'password or email invalid',
        HttpStatus.BAD_REQUEST
      );
    }
    return validationValue;
  }
}

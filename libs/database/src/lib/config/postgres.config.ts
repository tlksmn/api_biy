import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SellerEntity } from '../entities/seller.entity';
import { CityEntity } from '../entities/city.entity';
import { PointEntity } from '../entities/point.entity';
import { ProductEntity } from '../entities/product.entity';
import { ProductCountEntity } from '../entities/product.count.entity';
import { PointConfigEntity } from '../entities/point.config.entity';
import { UserEntity } from '../entities/user.entity';
import { ProxyEntity } from '../entities/proxy.entity';
import { RivalConfigEntity } from '../entities/rival.config.entity';

export function postgresConfig(): TypeOrmModuleAsyncOptions {
  return {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      username: configService.get('POSTGRES_USERNAME'),
      password: configService.get('POSTGRES_PASSWORD'),
      host: configService.get('POSTGRES_HOST'),
      port: configService.get('POSTGRES_PORT'),
      database: configService.get('POSTGRES_DATABASE'),
      synchronize: true,
      dropSchema: true,
      entities: [
        PointConfigEntity,
        CityEntity,
        PointEntity,
        ProductEntity,
        ProductCountEntity,
        RivalConfigEntity,
        SellerEntity,
        UserEntity,
        ProxyEntity,
      ],
    }),
  };
}

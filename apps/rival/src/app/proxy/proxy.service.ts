import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProxyEntity, proxyFrees } from '@biy/database';
import { Repository } from 'typeorm';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class ProxyService implements OnModuleInit {
  constructor(
    @InjectRepository(ProxyEntity)
    private readonly proxyRepository: Repository<ProxyEntity>
  ) {}

  private proxyIndex = 0;
  private proxyList: ProxyEntity[] = [];

  async onModuleInit(): Promise<void> {
    const count = await this.proxyRepository.count();
    if (count < 10) {
      const proxyAcc: ProxyEntity[] = [];
      for (const proxy of proxyFrees) {
        const temp = this.proxyRepository.create({
          host: proxy.host,
          port: proxy.port,
          protocol: proxy.protocol,
          password: proxy.auth?.password || null,
          username: proxy.auth?.username || null,
        });
        proxyAcc.push(temp);
      }
      const partial = 30;
      for (let i = 0; i * partial < proxyAcc.length; i++) {
        try {
          const rivalPartial = proxyAcc.slice(i * partial, (i + 1) * partial);
          await this.proxyRepository.save(rivalPartial);
        } catch (e) {
          Logger.log(e);
        }
      }
    }
    this.proxyList = await this.proxyRepository.find();
  }

  getNext() {
    const index = this.proxyIndex;
    if (index > this.proxyList.length) {
      this.proxyIndex = this.proxyList.length - index;
    }
    const proxy = this.proxyList[this.proxyIndex];
    const proxyAuth =
      proxy.protocol === 'https'
        ? { password: proxy.password, username: proxy.username }
        : {};

    const proxyAgent = new HttpsProxyAgent({
      port: proxy.port,
      host: proxy.host,
      secureProxy: proxy.protocol !== 'http',
      headers: {
        ...proxyAuth,
      },
    });
    this.proxyIndex++;
    return proxyAgent;
  }
}

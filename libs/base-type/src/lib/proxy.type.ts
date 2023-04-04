import { AT } from './a.type';

export type ProxyT = AT & {
  ip: string;
  port: string;
  username: string;
  password: string;
  country: string;
  active: boolean;
};

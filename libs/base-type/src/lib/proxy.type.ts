import { AT } from './a.type';

export type ProxyT = AT & {
  host: string;
  port: string;
  protocol: string;
  username: string;
  password: string;
  country: string;
  active: boolean;
};

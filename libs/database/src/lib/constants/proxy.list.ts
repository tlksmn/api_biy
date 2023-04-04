export interface ProxyAuth {
  username: string;
  password: string;
}

export interface ProxyFree {
  protocol: string;
  host: string;
  port: number;
  auth?: ProxyAuth;
}

export const proxyFrees: ProxyFree[] = [
  {
    protocol: 'http',
    host: '103.149.146.252',
    port: 80,
  },
  {
    protocol: 'http',
    host: '103.156.141.100',
    port: 80,
  },
  {
    protocol: 'http',
    host: '95.56.254.139',
    port: 3128,
  },
  {
    protocol: 'http',
    host: '198.59.191.234',
    port: 8080,
  },
  {
    protocol: 'http',
    host: '181.176.211.168',
    port: 8080,
  },
  {
    protocol: 'http',
    host: '117.160.250.138',
    port: 82,
  },
  {
    protocol: 'http',
    host: '103.117.192.14',
    port: 80,
  },
  {
    protocol: 'http',
    host: '117.160.250.137',
    port: 81,
  },
  {
    protocol: 'http',
    host: '117.157.197.18',
    port: 3128,
  },
  {
    protocol: 'http',
    host: '121.204.139.6',
    port: 3128,
  },
  {
    protocol: 'http',
    host: '103.145.113.78',
    port: 80,
  },
];

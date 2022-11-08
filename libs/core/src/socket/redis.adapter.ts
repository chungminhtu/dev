import { IoAdapter } from '@nestjs/platform-socket.io';
import { createClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import { config } from '../config';
import { Logger } from '@nestjs/common';

const pubClient = createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
  username: config.REDIS_USERNAME,
  password: config.REDIS_PASSWORD,
  database: parseInt(config.REDIS_STORAGE.SOCKET, 10),
});

const subClient = pubClient.duplicate();
const redisAdapter = createAdapter(pubClient, subClient);

export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger('SocketGateway');

  // @ts-ignore
  create(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ): any {
    if (options?.namespace) options.namespace = `/${config.SOCKET_NAMESPACE}${String(options.namespace)}`;
    this.logger.log(`Mapped {${String(options?.namespace)}, SOCKET} route`);
    // @ts-ignore
    return super.create(port, options);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(redisAdapter);
    return server;
  }
}

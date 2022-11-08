import { Transport } from '@nestjs/microservices';

import { ClientOptions, config } from '@core/config';

const generateRMQ = (queue) => ({
  transport: Transport.RMQ,
  options: {
    urls: [config.RABBITMQ_URL],
    queue,
    queueOptions: { durable: false },
  },
});

export const RMQ_PROXY_CONFIG = {
  GATEWAY_SERVICE: generateRMQ(config.RABBITMQ_GATEWAY_QUEUE) as ClientOptions,

  USER_SERVICE: generateRMQ(config.RABBITMQ_USER_QUEUE) as ClientOptions,

  TOKEN_SERVICE: generateRMQ(config.RABBITMQ_TOKEN_QUEUE) as ClientOptions,

  FILE_SERVICE: generateRMQ(config.RABBITMQ_FILE_QUEUE) as ClientOptions,

  ROLE_SERVICE: generateRMQ(config.RABBITMQ_ROLE_QUEUE) as ClientOptions,

  MAILER_SERVICE: generateRMQ(config.RABBITMQ_MAILER_QUEUE) as ClientOptions,

  STORY_SERVICE: generateRMQ(config.RABBITMQ_STORY_QUEUE) as ClientOptions,

  BACKUP_SERVICE: generateRMQ(config.RABBITMQ_BACKUP_SERVICE_QUEUE) as ClientOptions,
};

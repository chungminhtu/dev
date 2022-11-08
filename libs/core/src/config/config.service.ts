import * as ip from 'ip';
import * as customEnv from 'custom-env';
import * as path from 'path';
import * as ms from 'ms';
import { Transport } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';

import { DEFAULT_CACHE_LONG_TIMEOUT, DEFAULT_CACHE_TIMEOUT } from './config.constants';
import { FIREBASE_WEB } from '@shared/key/private-key.key';

process.env.NODE_ENV = process.env.NODE_ENV ?? 'dev';
const customEnvName = process.env.DOT_ENV_SUFFIX ?? process.env.NODE_ENV;
console.log('Using NODE_ENV: ' + process.env.NODE_ENV);
console.log('Using customEnvName: ' + customEnvName);
customEnv.env(customEnvName);
const _process = { env: process.env };
process.env = {};

@Injectable()
export class ConfigService {
  DEV = 'dev';
  TEST = 'test';
  PROD = 'prod';
  JEST = 'jest';
  NODE_ENV = _process.env.NODE_ENV;
  INSTANCE_ID = _process.env.INSTANCE_ID ?? 0;

  BASE_URI = _process.env.BASE_URI ?? 'http://localhost';
  PORT = _process.env.GATEWAY_PORT ?? '3000';
  LOCAL_IP: string = ip.address();
  PUBLIC_IP: string = _process.env.PUBLIC_IP ?? ip.address();
  HOST = _process.env.HOST ?? `http://${this.PUBLIC_IP}:${this.PORT}`;
  GATEWAY_HOST = `http://${_process.env.GATEWAY_IP}`;

  // Rabbit
  RABBITMQ_URL = _process.env.RABBITMQ_URL;
  RABBITMQ_GATEWAY_QUEUE = _process.env.RABBITMQ_GATEWAY_QUEUE;
  RABBITMQ_USER_QUEUE = _process.env.RABBITMQ_USER_QUEUE;
  RABBITMQ_TOKEN_QUEUE = _process.env.RABBITMQ_TOKEN_QUEUE;
  RABBITMQ_FILE_QUEUE = _process.env.RABBITMQ_FILE_QUEUE;
  RABBITMQ_ROLE_QUEUE = _process.env.RABBITMQ_ROLE_QUEUE;
  RABBITMQ_MAILER_QUEUE = _process.env.RABBITMQ_MAILER_QUEUE;
  RABBITMQ_SERVICE_QUEUE = _process.env.RABBITMQ_SERVICE_QUEUE;
  RABBITMQ_BACKUP_SERVICE_QUEUE = _process.env.RABBITMQ_BACKUP_SERVICE_QUEUE;
  RABBITMQ_STORY_QUEUE = _process.env.RABBITMQ_STORY_QUEUE;

  // MQTT
  MQTT_URL = _process.env.MQTT_URL;

  // ELASTICSEARCH
  ELASTICSEARCH_NODE = _process.env.ELASTICSEARCH_NODE;
  ELASTICSEARCH_INDEX = _process.env.ELASTICSEARCH_INDEX;
  ELASTICSEARCH_USERNAME = _process.env.ELASTICSEARCH_USERNAME;
  ELASTICSEARCH_PASSWORD = _process.env.ELASTICSEARCH_PASSWORD;

  // Mono Service
  GATEWAY_PORT = _process.env.GATEWAY_PORT ?? '3000';
  USER_SERVICE_PORT = _process.env.USER_SERVICE_PORT;
  MANAGER_COMPANY_SERVICE_PORT = _process.env.MANAGER_COMPANY_SERVICE_PORT;
  ROLE_SERVICE_PORT = _process.env.ROLE_SERVICE_PORT;
  BACKUP_SERVICE_PORT = _process.env.BACKUP_SERVICE_PORT;
  STORY_SERVICE_PORT = _process.env.STORY_SERVICE_PORT;

  // Vietnam Provinces online API
  ADDRESS_API = 'https://provinces.open-api.vn/api';

  // API Goong Map
  URL_GOONG_MAP = 'https://rsapi.goong.io';
  KEY_GOONG_MAP = _process.env.KEY_GOONG_MAP;

  //FIREBASE
  FIREBASE_CONFIG = {
    projectId: FIREBASE_WEB.project_id,
    clientEmail: FIREBASE_WEB.client_email,
    privateKey: FIREBASE_WEB.private_key.replace(/\\n/g, '\n'),
  };

  // Common
  DEBUG = (_process.env.DEBUG ?? 'false').toLowerCase() !== 'false';
  NODE_EVN = _process.env.NODE_ENV;
  PAGINATION_PAGE_SIZE = parseInt(_process.env.PAGINATION ?? '250', 10);
  UPLOAD_LIMIT = parseInt(_process.env.UPLOAD_LIMIT, 10) || 1024 * 1024 * 10; // Byte
  UPLOAD_PATH = _process.env.UPLOAD_PATH ?? 'uploads/';
  BACKUP_PATH = _process.env.BACKUP_PATH ?? 'backups/';

  // User
  PASSWORD_SALT = parseInt(_process.env.PASSWORD_SALT ?? '10', 10);
  REFRESH_SECRET = _process.env.REFRESH_SECRET ?? 'refresh-super-secret';
  REFRESH_TOKEN_EXP = _process.env.REFRESH_TOKEN_EXP ?? '7d';
  ACCESS_SECRET = _process.env.ACCESS_SECRET ?? 'access-super-secret';
  ACCESS_TOKEN_EXP = _process.env.ACCESS_TOKEN_EXP ?? '30d';
  OTP_SECRET = _process.env.OTP_SECRET ?? 'super-secret';
  OTP_OPTION = {
    digits: 4,
    step: 60,
    window: 1, // total time = step * window (sec)
  };
  BEARER_TEST = {};

  // Middleware
  CORS = {
    origin: true,
    credentials: true,
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders:
      'content-type, authorization, accept-encoding, user-agent, accept, cache-control, connection, cookie',
    exposedHeaders: 'X-RateLimit-Reset, set-cookie, Content-Disposition, X-File-Name',
  };
  RATE_LIMIT = {
    windowMs: 60 * 1000,
    max: parseInt(_process.env.RATE_LIMIT_MIN, 10) || 120,
  };
  FIXED_STATUS_CODE = (_process.env.SENTRY_LOG ?? 'true').toLowerCase() === 'true';

  // Namespace
  API_NAMESPACE = _process.env.API_NAMESPACE ?? 'api/v1';
  SOCKET_NAMESPACE = _process.env.SOCKET_NAMESPACE ?? 'socket';
  API_DOC_URL = '';

  // Special
  SR = {
    PRODUCT_NAME: _process.env.COMPANY_NAME,
    VERSION: 'v2.0',
    SIGNATURE: 'Tinasoft Develop Team',
    SOCIAL: {
      FACEBOOK_URL: 'https://www.facebook.com',
    },
    SUPPORT: {
      URL: 'https://domain/lien-he/',
      EMAIL: 'hotro@domain.vn',
    },
  };

  // Dir
  ROOT_PATH = path.resolve('.');
  STATIC_PATH = 'static';

  // Mail
  EMAIL_USE_TLS = (_process.env.EMAIL_USE_TLS ?? 'true').toLowerCase() === 'true';
  EMAIL_HOST = _process.env.EMAIL_HOST ?? 'smtp.gmail.com';
  EMAIL_USER = _process.env.EMAIL_USER ?? '';
  EMAIL_PASSWORD = _process.env.EMAIL_PASSWORD ?? '';
  EMAIL_PORT = parseInt(_process.env.EMAIL_PORT ?? '587', 10);

  // Schedule
  SCHEDULE_ENABLE = (_process.env.SCHEDULE_ENABLE ?? 'true').toLowerCase() === 'true';

  // Mongo
  MONGO_DSN = _process.env.MONGO_DSN ?? '';

  // Database
  DB_TYPE = _process.env.DB_TYPE ?? 'postgres';
  DB_HOST = _process.env.DB_HOST ?? '127.0.0.1';
  DB_PORT = parseInt(_process.env.DB_PORT ?? '5432', 10);
  DB_USERNAME = _process.env.DB_USERNAME ?? 'postgres';
  DB_PASSWORD = _process.env.DB_PASSWORD ?? '';
  DB_DATABASE = _process.env.DB_DATABASE ?? '';

  // Redis
  REDIS_HOST = _process.env.REDIS_HOST ?? '127.0.0.1';
  REDIS_PORT = parseInt(_process.env.REDIS_PORT ?? '6379', 10);
  REDIS_USERNAME = _process.env.REDIS_USERNAME ?? 'default';
  REDIS_PASSWORD = _process.env.REDIS_PASSWORD;
  REDIS_STORAGE = {
    // 0 ~ 15
    DB: _process.env.REDIS_STORAGE_DB ?? '0',
    GLOBAL: _process.env.REDIS_STORAGE_SYSTEM ?? '1',
    SETTING: _process.env.REDIS_STORAGE_SETTING ?? '2',
    AUTH: _process.env.REDIS_STORAGE_SETTING ?? '3',
    USER: _process.env.REDIS_STORAGE_SETTING ?? '4',
    SOCKET: _process.env.REDIS_STORAGE_SOCKET ?? '5',
    METRICS: '6',
    SEARCH: _process.env.REDIS_STORAGE_SEARCH ?? '7',
  };

  // Cache
  CACHE_TIMEOUT = ms(_process.env.CACHE_TIMEOUT ?? DEFAULT_CACHE_TIMEOUT);
  CACHE_LONG_TIMEOUT = ms(_process.env.CACHE_LONG_TIMEOUT ?? DEFAULT_CACHE_LONG_TIMEOUT);
  CACHE_SETTING_TIMEOUT = ms(_process.env.CACHE_SETTING_TIMEOUT ?? DEFAULT_CACHE_LONG_TIMEOUT);
  CACHE_DB_TIMEOUT = ms('5s');

  // AWS
  AWS = {
    AWS_REGION: _process.env.AWS_REGION,
    ACCESS_KEY: _process.env.AWS_ACCESS_KEY,
    SECRET_KEY: _process.env.AWS_SECRET_KEY,

    S3: {
      BUCKET_NAME: _process.env.AWS_BUCKET_NAME,
    },
  };
}

export const config = new ConfigService();

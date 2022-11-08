/* Overview Microservice
  https://docs.nestjs.com/microservices/basics
 */

import { Transport } from '@nestjs/microservices';
import {
  GrpcOptions,
  KafkaOptions,
  MqttOptions,
  NatsOptions,
  RedisOptions,
  RmqOptions,
} from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { TcpClientOptions } from '@nestjs/microservices/interfaces/client-metadata.interface';
export declare type ClientOptions =
  | RedisOptions
  | NatsOptions
  | MqttOptions
  | GrpcOptions
  | KafkaOptions
  | TcpClientOptions
  | RmqOptions;

export interface IServiceConfig {
  // Service
  [service: string]: Record<string, ClientOptions>;
}

export interface IEnvConfig {
  BASE_URI?: string;
  PORT: string | number;

  // Service
  USER_SERVICE?: ClientOptions;
  TOKEN_SERVICE?: ClientOptions;
  MAILER_SERVICE?: ClientOptions;

  // Env
  DEBUG?: string | boolean;
  NODE_EVN?: string;
  PAGINATION_PAGE_SIZE?: string | number;

  LOCAL_IP: string;
  PUBLIC_IP: string;
  HOST: string;

  PASSWORD_SALT?: string | number;
  REFRESH_SECRET?: string;
  REFRESH_TOKEN_EXP?: string;
  ACCESS_SECRET?: string;
  ACCESS_TOKEN_EXP?: string;
  OTP_SECRET?: string;
  OTP_OPTION?: Record<string, number | string>;
  BEARER_TEST?: Record<any, any>;

  [key: string]: any;
}

export interface ICoreConfig {
  CORS: Record<string, any>;
  RATE_LIMIT: Record<string, any>;
  FIXED_STATUS_CODE: boolean;
  API_NAMESPACE: string;
  SOCKET_NAMESPACE: string;
  API_DOC_URL: string;
  SR: Record<string, any>;
  ROOT_PATH: string;
  STATIC_PATH: string;

  // Email
  EMAIL_USE_TLS?: boolean;
  EMAIL_HOST?: string;
  EMAIL_USER?: string;
  EMAIL_PASSWORD?: string;
  EMAIL_PORT?: string | number;

  SCHEDULE_ENABLE: boolean;

  [key: string]: any;
}

export interface IDbConfig {
  // Mongo
  MONGO_DSN?: string;

  // Database
  DB_TYPE?: string;
  DB_HOST?: string;
  DB_PORT?: string | number;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_DATABASE?: string;

  // Redis
  REDIS_HOST?: string;
  REDIS_PORT?: string | number;
  REDIS_USERNAME?: string;
  REDIS_PASSWORD?: string;
  REDIS_STORAGE?: Record<string, number>;

  // Cache
  CACHE_TIMEOUT?: string;
  CACHE_LONG_TIMEOUT?: string;
  CACHE_SETTING_TIMEOUT?: string | number;
  CACHE_DB_TIMEOUT?: string;

  [key: string]: any;
}

export enum EEnvConfig {
  BASE_URI = 'BASE_URI',
  PORT = 'PORT',
  GATEWAY_PORT = 'GATEWAY_PORT',
  USER_SERVICE_PORT = 'USER_SERVICE_PORT',

  // Service
  // USER_SERVICE = 'USER_SERVICE',
  // TOKEN_SERVICE = 'TOKEN_SERVICE',
  // MAILER_SERVICE = 'MAILER_SERVICE',

  // Env
  DEBUG = 'DEBUG',
  NODE_EVN = 'NODE_EVN',
  PAGINATION_PAGE_SIZE = 'PAGINATION_PAGE_SIZE',

  LOCAL_IP = 'LOCAL_IP',
  PUBLIC_IP = 'PUBLIC_IP',
  HOST = 'HOST',

  PASSWORD_SALT = 'PASSWORD_SALT',
  REFRESH_SECRET = 'REFRESH_SECRET',
  REFRESH_TOKEN_EXP = 'REFRESH_TOKEN_EXP',
  ACCESS_SECRET = 'ACCESS_SECRET',
  OTP_SECRET = 'OTP_SECRET',
  OTP_OPTION = 'OTP_OPTION',
  BEARER_TEST = 'BEARER_TEST',
}

export enum EDbConfig {
  // Mongo
  MONGO_DSN = 'MONGO_DSN',

  // Database
  DB_TYPE = 'DB_TYPE',
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_DATABASE = 'DB_DATABASE',

  // Redis
  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_USERNAME = 'REDIS_USERNAME',
  REDIS_PASSWORD = 'REDIS_PASSWORD',
  REDIS_STORAGE = 'REDIS_STORAGE',

  // Cache
  CACHE_TIMEOUT = 'CACHE_TIMEOUT',
  CACHE_LONG_TIMEOUT = 'CACHE_LONG_TIMEOUT',
  CACHE_SETTING_TIMEOUT = 'CACHE_SETTING_TIMEOUT',
  CACHE_DB_TIMEOUT = 'CACHE_DB_TIMEOUT',
}

export enum ECoreConfig {
  CORS = 'CORS',
  RATE_LIMIT = 'RATE_LIMIT',
  FIXED_STATUS_CODE = 'FIXED_STATUS_CODE',
  API_NAMESPACE = 'API_NAMESPACE',
  SOCKET_NAMESPACE = 'SOCKET_NAMESPACE',
  API_DOC_URL = 'API_DOC_URL',
  SR = 'SR',
  ROOT_PATH = 'ROOT_PATH',
  STATIC_PATH = 'STATIC_PATH',

  // Email
  EMAIL_USE_TLS = 'EMAIL_USE_TLS',
  EMAIL_HOST = 'EMAIL_HOST',
  EMAIL_USER = 'EMAIL_USER',
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
  EMAIL_PORT = 'EMAIL_PORT',

  SCHEDULE_ENABLE = 'SCHEDULE_ENABLE',
}

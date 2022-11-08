import { Injectable } from '@nestjs/common';
import { RedisClientType } from '@redis/client';
import * as redisStore from 'cache-manager-redis-store';
import * as cacheManager from 'cache-manager';
import { createClient as redisCreateClient } from 'redis';
import { Logger } from 'log4js';
import { classToPlain, instanceToPlain, plainToClass } from 'class-transformer';

// CORE
import { config } from '@core/config';
import { LoggingService } from '@core/logging';
import { RedisZSetResp } from '@core/db/redis/redis.interface';
import {
  BRANCH_CACHE_KEY_PREFIX,
  CAMPAIGN_CACHE_KEY_PREFIX,
  ORDERS_CACHE_KEY_PREFIX,
} from '@core/db/redis/redis.constant';

@Injectable()
export class RedisService {
  private readonly logger: Logger;
  private readonly store: RedisClientType;

  constructor(private readonly logging: LoggingService) {
    this.logger = this.logging.getLogger('redis');

    this.store = redisCreateClient({
      url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
      username: config.REDIS_USERNAME,
      password: config.REDIS_PASSWORD,
      database: parseInt(config.REDIS_STORAGE.DB, 10),
    });

    this.store.on('error', (error) => {
      this.logger.error('Try to connect to Redis ...');
      this.logger.error(error);
    });

    this.store.connect();
  }

  private createClient(db: string, ttl: number = config.CACHE_TIMEOUT) {
    const redisCache = cacheManager.caching({
      store: redisStore,
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD,
      db,
      ttl: ttl / 1000, // sec
    });
    const redisClient = redisCache.store.getClient();
    redisClient.on('error', (error) => {
      this.logger.error('Try to connect to Redis ...');
      this.logger.error(error);
    });

    async function getDefined<T = any>(key: string, defaultValue: T): Promise<T> {
      const valueCache = await redisCache.get(key);
      if (![null, undefined].includes(valueCache)) return valueCache;
      return defaultValue;
    }

    redisCache.getDefined = getDefined;
    return redisCache;
  }

  global = this.createClient(config.REDIS_STORAGE.GLOBAL);
  setting = this.createClient(config.REDIS_STORAGE.SETTING, config.CACHE_SETTING_TIMEOUT);
  metrics = this.createClient(config.REDIS_STORAGE.METRICS, config.CACHE_LONG_TIMEOUT);

  // Orders
  generateOrdersCacheKey(ordersId: number): string {
    return `${ORDERS_CACHE_KEY_PREFIX}:${ordersId}`;
  }

  // Branch
  generateBranchCacheKey(branchId: number): string {
    return `${BRANCH_CACHE_KEY_PREFIX}:${branchId}`;
  }

  // Campaign
  generateCampaignCacheKey(campaignId: number): string {
    return `${CAMPAIGN_CACHE_KEY_PREFIX}:${campaignId}`;
  }

  async cacheToHashes<T>(key: string, data: T, exp?: number): Promise<void> {
    const cacheObj = instanceToPlain<T>(data);

    await this.store.hSet(key, this._parseObj2HashesObj(cacheObj));
    if (exp) {
      await this.store.expire(key, exp);
    }

    return;
  }

  async getCachedFromHashes<T>(key: string): Promise<T> {
    const cachedObj = await this.store.hGetAll(key);

    // TODO: I can pass with null class, check me later
    const plainObj = cachedObj ? this._parseObjHashes2Obj(cachedObj) : null;
    return plainObj && Object.keys(plainObj).length ? plainToClass<T, Record<string, any>>(null, plainObj) : null;
  }

  async deleteCachedInHashes(key: string): Promise<void> {
    const allKeys = await this.store.hKeys(key);
    await this.store.hDel(key, allKeys);

    return;
  }

  async cacheToStandard(key: string, value: string, exp?: number): Promise<void> {
    await this.store.set(key, value);
    if (exp) {
      await this.store.expire(key, exp);
    }

    return;
  }

  async getCachedFromStandard(key: string): Promise<string> {
    return await this.store.get(key);
  }

  async deleteCachedInStandard(key: string): Promise<void> {
    await this.store.del(key);
    return;
  }

  async cacheToZset(key: string, members: RedisZSetResp | RedisZSetResp[], exp?: number): Promise<void> {
    await this.store.zAdd(key, members);
    if (exp) {
      await this.store.expire(key, exp);
    }

    return;
  }

  async getCachedFromZset(key: string, startIdx: number, endIdx: number): Promise<RedisZSetResp[]> {
    return await this.store.zRangeWithScores(key, startIdx, endIdx);
  }

  async deleteCachedInZset(key: string, members: string | string[]): Promise<void> {
    await this.store.zRem(key, members);
    return;
  }

  private _parseObj2HashesObj(obj: Record<string, any>): Record<string, string> {
    const parsedObj: Record<string, string> = {};

    const keys = obj ? Object.keys(obj) : [];
    keys.forEach((key) => {
      parsedObj[key] = JSON.stringify(obj[key] !== undefined ? obj[key] : null);
    });

    return parsedObj;
  }

  private _parseObjHashes2Obj(hashesObj: Record<string, string>): Record<string, any> {
    const parsedObj: Record<string, any> = {};

    const keys = hashesObj ? Object.keys(hashesObj) : [];
    keys.forEach((key) => {
      parsedObj[key] = JSON.parse(hashesObj[key]);
    });

    return parsedObj;
  }
}

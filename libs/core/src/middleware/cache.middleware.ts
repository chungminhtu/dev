import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Core
import { RedisService } from '@core/db/redis';

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const data = await this.redisService.setting.get(req.url);
    if (data) {
      return res.json({
        success: true,
        errorCode: '200',
        message: 'Cached data',
        data: data,
      });
    } else {
      next();
    }
  }
}

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { environment } from '../../environment';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: environment.REDIS_HOST,
      port: environment.REDIS_PORT,
      username: environment.REDIS_USERNAME,
      password: environment.REDIS_PASSWORD,
    });

    this.client.on('connect', () => {
      console.log('[Redis] Connected');
    });

    this.client.on('error', (err) => {
      console.error('[Redis] Error:', err);
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, expireInSeconds?: number): Promise<'OK'> {
    if (expireInSeconds) {
      return this.client.set(key, value, 'EX', expireInSeconds);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  // Expose raw client if needed
  getClient(): Redis {
    return this.client;
  }
}

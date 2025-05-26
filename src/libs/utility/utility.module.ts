import { Global, Inject, Injectable, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { uuidv7 } from "uuidv7";
import moment from 'moment';
import { RedisModule } from '../redis/redis.module';
import { UserInterface } from './interface/user.interface';
import { environment } from 'src/environment';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UtilityImplement {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  generateId() {
    return uuidv7();
  }

  passwordHash(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  passwordVerify(plainPass: string, hashedPass: string): boolean {
    return bcrypt.compareSync(plainPass, hashedPass);
  }

  generateAccessToken(user: UserInterface): string {
    return this.jwtService.sign(
      { user },
      {
        secret: environment.JWT_ACCESS_SECRET,
        expiresIn: `${environment.JWT_ACCESS_EXPIRE}d`,
      },
    );
  }

  generateRefreshToken(user: UserInterface): string {
    return this.jwtService.sign(
      { user },
      {
        secret: environment.JWT_REFRESH_SECRET,
        expiresIn: `${environment.JWT_REFRESH_EXPIRE}d`,
      },
    );
  }

  verifyAccessToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: environment.JWT_ACCESS_SECRET,
    });
  }

  verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: environment.JWT_REFRESH_SECRET,
    });
  }

  async setRefreshToken(accessToken: string, refreshToken: string) {
    await this.redisService.set(accessToken, refreshToken, {
      ttl: environment.JWT_REFRESH_EXPIRE * 24 * 3600,
    } as any);
  }

  async deleteRefreshToken(id: string) {
    await this.redisService.del(id);
  }

  async getRedisKey(key: string): Promise<string | undefined> {
    return await this.redisService.get(key);
  }

  async setBlackListToken(key: string, value: string) {
    await this.redisService.set(key, value, {
      ttl: environment.JWT_ACCESS_EXPIRE * 24 * 3600,
    } as any);
  }

  async handleError<T>(promise: Promise<T>): Promise<[any, undefined] | (T | undefined)[]> {
    return promise.then((data) => [undefined, data]).catch((error) => [error, undefined]);
  }

  buildSearch(item: any) {
    let value;
    if (item.valueType === 'text') {
      value = { contains: item.value, mode: 'insensitive' };
    }
    if (item.valueType === 'number') {
      value = Number(item.value);
    }
    if (item.valueType === 'date') {
      const fromDate = moment(item.fromDate).toDate();
      const toDate = moment(item.toDate).toDate();
      value = { gte: fromDate, lt: toDate };
    }
    if (item.valueType === 'set') {
      value = { in: Array.from(item.value) };
    }
    if (item.valueType === 'boolean') {
      value = { eq: item.value };
    }

    return { value };
  }
}

@Global()
@Module({
  imports: [JwtModule.register({}), RedisModule],
  providers: [UtilityImplement],
  exports: [UtilityImplement],
})
export class UtilityModule {}

import { Logger } from '@nestjs/common';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import * as dotenv from 'dotenv';
dotenv.config();

enum Environment {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

class EnvironmentVariables {
  private readonly logger = new Logger(EnvironmentVariables.name);

  @IsString()
  readonly APPNAME: string = process.env['APPNAME'] as string;

  @IsString()
  readonly DB_HOST: string = process.env['DB_HOST'] as string;

  @IsNumber()
  readonly DB_PORT: number = Number(process.env['DB_PORT']);

  @IsString()
  readonly DB_USERNAME: string = process.env['DB_USERNAME'] as string;

  @IsString()
  readonly DB_PASSWORD: string = process.env['DB_PASSWORD'] as string;

  @IsString()
  readonly DB_NAME: string = process.env['DB_NAME'] as string;

  @IsNumber()
  readonly DB_LOGGING: number = Number(process.env['DB_LOGGING']);

  @IsEnum(Environment)
  readonly NODE_ENV: Environment = process.env['NODE_ENV'] as Environment;

  @IsNumber()
  readonly PORT: number = Number(process.env['PORT']);

  @IsString()
  readonly JWT_ACCESS_SECRET: string = process.env['JWT_ACCESS_SECRET'] as string;

  @IsNumber()
  readonly JWT_ACCESS_EXPIRE: number = Number(process.env['JWT_ACCESS_EXPIRE']);

  @IsString()
  readonly JWT_REFRESH_SECRET: string = process.env['JWT_REFRESH_SECRET'] as string;

  @IsNumber()
  readonly JWT_REFRESH_EXPIRE: number = Number(process.env['JWT_REFRESH_EXPIRE']);

  @IsString()
  readonly REDIS_HOST: string = process.env['REDIS_HOST'] as string;

  @IsNumber()
  readonly REDIS_PORT: number = Number(process.env['REDIS_PORT']);

  @IsString()
  readonly REDIS_USERNAME: string = process.env['REDIS_USERNAME'] as string;

  @IsString()
  readonly REDIS_PASSWORD: string = process.env['REDIS_PASSWORD'] as string;

  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    this.logger.error(`Config validation error: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

export const environment = new EnvironmentVariables();

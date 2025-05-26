import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from 'src/environment';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: environment.DB_HOST,
        port: environment.DB_PORT,
        username: environment.DB_USERNAME,
        password: environment.DB_PASSWORD,
        database: environment.DB_NAME,
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: environment.DB_LOGGING === 1,
      }),
    }),
  ],
})
export class DatabaseModule { } 
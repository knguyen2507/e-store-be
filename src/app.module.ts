import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilityModule } from './libs/utility/utility.module';
import { RedisModule } from './libs/redis/redis.module';
import { GuardModule } from './libs/guard/guard.module';
import { ProductModule } from './modules/products/product.module';
import { DatabaseModule } from './libs/database/database.module';


@Module({
  imports: [
    UtilityModule,
    GuardModule,
    RedisModule,
    ProductModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './infrastructure/entity/product.entity';
import { ProductCommandController } from './presentation/command.controller';
import { ProductQueryController } from './presentation/query.controller';
import { ProductRepositoryImplement } from './infrastructure/repository';
import { CreateProductHandler } from './application/command/product/create/handler';
import { UpdateProductHandler } from './application/command/product/update/handler';
import { FindProductByCodeHandler } from './application/query/product/detail/handler';
import { FindProductHandler } from './application/query/product/find/handler';
import { FindProductByIdHandler } from './application/query/product/find-by-id/handler';
import { ProductFactory } from './infrastructure/factory/product';
import { ProductQueryImplement } from './infrastructure/query';

const infrastructure = [ProductRepositoryImplement, ProductQueryImplement];

const commands = [CreateProductHandler, UpdateProductHandler];

const queries = [
  FindProductByCodeHandler,
  FindProductHandler,
  FindProductByIdHandler,
];

const domain = [ProductFactory];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductEntity])
  ],
  controllers: [ProductCommandController, ProductQueryController],
  providers: [...infrastructure, ...commands, ...queries, ...domain],
})
export class ProductModule { }

import { Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UtilityImplement } from 'src/libs/utility/utility.module';
import { ProductQuery } from 'src/modules/products/domain/query';
import { FindProduct } from 'src/modules/products/application/query/product/find';
import { FindProductResult, FindProductResultItem } from 'src/modules/products/application/query/product/find/result';
import { FindProductByCode } from 'src/modules/products/application/query/product/detail';
import { FindProductByCodeResult } from 'src/modules/products/application/query/product/detail/result';
import { FindProductById } from 'src/modules/products/application/query/product/find-by-id';
import { FindProductByIdResult } from 'src/modules/products/application/query/product/find-by-id/result';
import { ProductEntity } from 'src/modules/products/infrastructure/entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ProductQueryImplement implements ProductQuery {
  @Inject()
  private readonly util: UtilityImplement;
  @InjectRepository(ProductEntity)
  private readonly repository: Repository<ProductEntity>;

  async find(query: FindProduct): Promise<FindProductResult> {
    const { offset, limit, searchName } = query.data;
    const list_condition = [];
    list_condition.push({is_deleted: false});
    if (searchName) {
      list_condition.push({ name: { contains: searchName, mode: 'insensitive' } });
    }

    const conditions = list_condition.length > 1
      ? Object.assign({}, ...list_condition)
      : list_condition[0];

    const [products, total] = await Promise.all([
      this.repository.find({
        where: conditions,
        skip: Number(offset),
        take: Number(limit),
        order: {
          created_at: 'desc',
        },
      }),
      this.repository.count({ where: conditions }),
    ]);

    const items = products.map((i) => {
      const {is_deleted, ...data} = i;
      return plainToClass(
        FindProductResultItem,
        data,
        { excludeExtraneousValues: true },
      );
    });

    return {
      items,
      total,
    };
  }

  async findByCode(query: FindProductByCode): Promise<FindProductByCodeResult> {
    const product = await this.repository.findOneBy({
      code: query.data.code
    });

    const {is_deleted, ...data} = product;

    return plainToClass(FindProductByCodeResult, data, {
      excludeExtraneousValues: true,
    });
  }

  async findById(query: FindProductById): Promise<FindProductByIdResult> {
    const product = await this.repository.findOneBy({
      id: query.data.id
    });

    const {is_deleted, ...data} = product;

    return plainToClass(FindProductByIdResult, data, {
      excludeExtraneousValues: true,
    });
  }
}

import { Inject, NotFoundException } from '@nestjs/common';
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
    const { offset = 0, limit = 10, searchName, sortBy = 'created_at', sortOrder = 'DESC' } = query.data;
    
    // Build query using QueryBuilder for better performance
    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .where('product.is_deleted = :isDeleted', { isDeleted: false });

    // Add search conditions
    if (searchName) {
      queryBuilder.andWhere('product.name ILIKE :searchName', { searchName: `%${searchName}%` });
    }

    // Add sorting
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    // Add pagination
    queryBuilder
      .skip(Number(offset))
      .take(Number(limit));

    // Execute query with COUNT
    const [products, total] = await queryBuilder.getManyAndCount();

    const items = products.map((product) => {
      const { is_deleted, ...data } = product;
      return plainToClass(
        FindProductResultItem,
        data,
        { excludeExtraneousValues: true },
      );
    });

    return {
      items,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findByCode(query: FindProductByCode): Promise<FindProductByCodeResult> {
    const product = await this.repository
      .createQueryBuilder('product')
      .where('product.code = :code', { code: query.data.code })
      .andWhere('product.is_deleted = :isDeleted', { isDeleted: false })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product with code ${query.data.code} not found`);
    }

    const { is_deleted, ...data } = product;

    return plainToClass(FindProductByCodeResult, data, {
      excludeExtraneousValues: true,
    });
  }

  async findById(query: FindProductById): Promise<FindProductByIdResult> {
    const product = await this.repository
      .createQueryBuilder('product')
      .where('product.id = :id', { id: query.data.id })
      .andWhere('product.is_deleted = :isDeleted', { isDeleted: false })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product with id ${query.data.id} not found`);
    }

    const { is_deleted, ...data } = product;

    return plainToClass(FindProductByIdResult, data, {
      excludeExtraneousValues: true,
    });
  }
}

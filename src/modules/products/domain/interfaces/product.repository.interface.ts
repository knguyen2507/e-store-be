import { ProductEntity } from 'src/modules/products/infrastructure/entity/product.entity';
import { CreateProductDto } from 'src/modules/products/presentation/dto/command/create-product.dto';
import { FindProductDto } from 'src/modules/products/presentation/dto/command/find-product.dto';
import { UpdateProductDto } from 'src/modules/products/presentation/dto/command/update-product.dto';

export interface IProductRepository {
  create(dto: CreateProductDto): Promise<ProductEntity>;
  update(id: string, dto: UpdateProductDto): Promise<ProductEntity>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<ProductEntity>;
  findAll(dto: FindProductDto): Promise<[ProductEntity[], number]>;
  findByCode(code: string): Promise<ProductEntity>;
} 
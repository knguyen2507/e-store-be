import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UtilityImplement } from 'src/libs/utility/utility.module';
import { FindProductByCode } from '../application/query/product/detail';
import { FindProduct } from '../application/query/product/find';
import { FindProductById } from '../application/query/product/find-by-id';
import { FindProductByCodeRequestDTO } from './dto/query/find.by.code.dto';
import { FindProductByIdRequestDTO } from './dto/query/find.by.id.dto';
import { FindProductRequestDTO } from './dto/query/find.dto';

@ApiTags('product/query')
@Controller('product/query')
export class ProductQueryController {
  constructor(
    private readonly util: UtilityImplement,
    readonly queryBus: QueryBus,
  ) {}

  @Get('list')
  async FindProducts(@Query() query: FindProductRequestDTO): Promise<any> {
    const msg = {
      messageId: this.util.generateId(),
      data: query,
    };
    const product = new FindProduct(msg);
    return await this.queryBus.execute(product);
  }

  @Get('by-code')
  async FindProductByCode(@Query() query: FindProductByCodeRequestDTO): Promise<any> {
    const msg = {
      messageId: this.util.generateId(),
      data: query,
    };
    const product = new FindProductByCode(msg);
    return await this.queryBus.execute(product);
  }

  @Get('by-id')
  @ApiBearerAuth()
  async FindProductById(@Query() query: FindProductByIdRequestDTO): Promise<any> {
    const msg = {
      messageId: this.util.generateId(),
      data: query,
    };
    const product = new FindProductById(msg);
    return await this.queryBus.execute(product);
  }
}

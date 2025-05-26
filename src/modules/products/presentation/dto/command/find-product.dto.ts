import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SortOrder } from 'src/libs/utility/enum';

export class FindProductDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  take?: number;
} 
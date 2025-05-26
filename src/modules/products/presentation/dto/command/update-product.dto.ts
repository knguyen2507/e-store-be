import { IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsDefined()
  id: string;
  
  @IsString()
  @IsOptional()
  name?: string;
} 
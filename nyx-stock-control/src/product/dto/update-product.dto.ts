import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
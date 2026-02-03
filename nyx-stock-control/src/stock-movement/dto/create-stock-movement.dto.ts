import { IsUUID, IsEnum, IsInt, IsPositive, IsOptional, IsString } from 'class-validator';
import { MovementType } from '../../prisma/generated/prisma';

export class CreateStockMovementDto {
  @IsUUID()
  productId: string;

  @IsEnum(MovementType)
  type: MovementType;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
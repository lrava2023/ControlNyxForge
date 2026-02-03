import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Identificador único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Gamer',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto (opcional)',
    example: 'Laptop para juegos con alta performance',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'SKU único del producto',
    example: 'LAP-GAMER-001',
  })
  sku: string;

  @ApiProperty({
    description: 'Cantidad actual en stock',
    example: 25,
  })
  stock: number;

  @ApiProperty({
    description: 'Indica si el producto está activo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-20T14:45:00.000Z',
  })
  updatedAt: Date;
}
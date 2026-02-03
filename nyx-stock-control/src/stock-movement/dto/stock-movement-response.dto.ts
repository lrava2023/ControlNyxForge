import { ApiProperty } from '@nestjs/swagger';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

export class StockMovementResponseDto {
  @ApiProperty({
    description: 'Identificador único del movimiento',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  id: string;

  @ApiProperty({
    description: 'Tipo de movimiento (IN para entrada, OUT para salida)',
    enum: MovementType,
    example: 'IN',
  })
  type: MovementType;

  @ApiProperty({
    description: 'Cantidad movida',
    example: 10,
  })
  quantity: number;

  @ApiProperty({
    description: 'Razón del movimiento (opcional)',
    example: 'Compra de proveedor',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    description: 'Fecha de creación del movimiento',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Información del producto relacionado',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nombre del producto',
        example: 'Laptop Gamer',
      },
      sku: {
        type: 'string',
        description: 'SKU del producto',
        example: 'LAP-GAMER-001',
      },
    },
  })
  product: {
    name: string;
    sku: string;
  };
}

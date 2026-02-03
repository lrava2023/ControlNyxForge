import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP de la respuesta',
    example: 400,
    type: 'number',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Código de error de dominio',
    example: 'PRODUCT_NOT_FOUND',
    type: 'string',
  })
  error: string;

  @ApiProperty({
    description: 'Mensaje descriptivo del error',
    example: 'Producto con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado',
    type: 'string',
  })
  message: string;

  @ApiProperty({
    description: 'Marca de tiempo de cuando ocurrió el error',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta de la solicitud que generó el error',
    example: '/api/products/123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  path: string;
}
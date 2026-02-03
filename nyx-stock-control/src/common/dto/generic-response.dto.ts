import { ApiProperty } from '@nestjs/swagger';

export class GenericResponseDto<T> {
  @ApiProperty({
    description: 'Datos de la respuesta',
    type: 'object',
    additionalProperties: true,
  })
  data: T;
}

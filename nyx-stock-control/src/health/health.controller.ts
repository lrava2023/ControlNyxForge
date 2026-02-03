import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenericResponseDto } from '../common/dto/generic-response.dto';

interface HealthResponse {
  status: string;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verificar estado de salud del servicio' })
  @ApiResponse({ 
    status: 200, 
    description: 'Servicio operativo', 
    type: GenericResponseDto<HealthResponse> 
  })
  getHealth(): HealthResponse {
    return { status: 'ok' };
  }
}
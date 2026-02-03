import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { StockMovementService } from './stock-movement.service';
import { CreateStockMovementDto, StockMovementResponseDto } from './dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { GenericResponseDto } from '../common/dto/generic-response.dto';

@ApiTags('stock')
@Controller('stock')
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) {}

  // Registrar entrada de stock
  @Post('in')
  @ApiOperation({ summary: 'Registrar entrada de stock' })
  @ApiOkResponse({ 
    description: 'Entrada de stock registrada exitosamente', 
    type: GenericResponseDto<StockMovementResponseDto> 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos inválidos o error de dominio', 
    type: ErrorResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado', 
    type: ErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor', 
    type: ErrorResponseDto 
  })
  async registerIn(@Body() createDto: CreateStockMovementDto) {
    if (createDto.type !== 'IN') {
      throw new BadRequestException('Para registrar entrada, el tipo debe ser IN');
    }

    return this.stockMovementService.registerIn(
      createDto.productId,
      createDto.quantity,
      createDto.reason,
    );
  }

  // Registrar salida de stock
  @Post('out')
  @ApiOperation({ summary: 'Registrar salida de stock' })
  @ApiOkResponse({ 
    description: 'Salida de stock registrada exitosamente', 
    type: GenericResponseDto<StockMovementResponseDto> 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos inválidos o error de dominio', 
    type: ErrorResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado', 
    type: ErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor', 
    type: ErrorResponseDto 
  })
  async registerOut(@Body() createDto: CreateStockMovementDto) {
    if (createDto.type !== 'OUT') {
      throw new BadRequestException('Para registrar salida, el tipo debe ser OUT');
    }

    return this.stockMovementService.registerOut(
      createDto.productId,
      createDto.quantity,
      createDto.reason,
    );
  }

  // Obtener historial de movimientos de un producto
  @Get('products/:id/movements')
  @ApiOperation({ summary: 'Obtener historial de movimientos de un producto' })
  @ApiOkResponse({ 
    description: 'Historial de movimientos obtenido exitosamente', 
    type: GenericResponseDto<StockMovementResponseDto[]> 
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado', 
    type: ErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor', 
    type: ErrorResponseDto 
  })
  async getHistoryByProduct(@Param('id', ParseUUIDPipe) id: string): Promise<StockMovementResponseDto[]> {
    const movements = await this.stockMovementService.getHistoryByProduct(id);
    return movements.map(movement => ({
      id: movement.id,
      type: movement.type,
      quantity: movement.quantity,
      reason: movement.reason,
      createdAt: movement.createdAt,
      product: {
        name: movement.product.name,
        sku: movement.product.sku,
      },
    }));
  }
}

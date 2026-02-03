import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { GenericResponseDto } from '../common/dto/generic-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Crear un nuevo producto
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos', 
    type: ErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor', 
    type: ErrorResponseDto 
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  // Obtener todos los productos activos
  @Get()
  @ApiOperation({ summary: 'Listar todos los productos activos' })
  @ApiOkResponse({ 
    description: 'Lista de productos obtenida exitosamente', 
    type: GenericResponseDto<ProductResponseDto[]> 
  })
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productService.findAll();
    return products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      stock: product.stock,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }

  // Obtener un producto por ID
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiOkResponse({ 
    description: 'Producto encontrado', 
    type: GenericResponseDto<ProductResponseDto> 
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado', 
    type: ErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor', 
    type: ErrorResponseDto 
  })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponseDto> {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      stock: product.stock,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  // Obtener stock actual de un producto
  @Get(':id/stock')
  @ApiOperation({ summary: 'Obtener el stock actual de un producto' })
  @ApiOkResponse({ 
    description: 'Stock obtenido exitosamente', 
    type: GenericResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado', 
    type: ErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor', 
    type: ErrorResponseDto 
  })
  async getStock(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.getStock(id);
  }

  // Listar productos con su stock actual
  @Get('with-stock')
  @ApiOperation({ summary: 'Listar productos con su stock actual' })
  @ApiOkResponse({ 
    description: 'Lista de productos con stock obtenida exitosamente', 
    type: GenericResponseDto<ProductResponseDto[]> 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor', 
    type: ErrorResponseDto 
  })
  async listWithStock(): Promise<ProductResponseDto[]> {
    const products = await this.productService.listWithStock();
    return products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      stock: product.stock,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }

  // Actualizar un producto
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiOkResponse({ 
    description: 'Producto actualizado exitosamente', 
    type: GenericResponseDto<ProductResponseDto> 
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado', 
    type: ErrorResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos', 
    type: ErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor', 
    type: ErrorResponseDto 
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  // Eliminación lógica (soft delete)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar lógicamente un producto' })
  @ApiOkResponse({ 
    description: 'Producto eliminado exitosamente', 
    type: GenericResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado', 
    type: ErrorResponseDto 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor', 
    type: ErrorResponseDto 
  })
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.softDelete(id);
  }
}

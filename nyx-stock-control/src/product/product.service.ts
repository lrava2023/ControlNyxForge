import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { DomainException, DomainErrorCode } from '../common/exceptions/domain.exception';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear un nuevo producto
  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  // Obtener todos los productos
  async findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
    });
  }

  // Obtener un producto por ID
  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // Obtener stock actual de un producto
  async getStock(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new DomainException(
        DomainErrorCode.PRODUCT_NOT_FOUND,
        `Producto con ID ${productId} no encontrado`,
      );
    }

    return {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      currentStock: product.stock,
      isActive: product.isActive,
    };
  }

  // Listar productos con su stock actual
  async listWithStock() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  // Actualizar un producto
  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  // Eliminación lógica (soft delete)
  async softDelete(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

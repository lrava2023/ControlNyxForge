import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto';
import { DomainException, DomainErrorCode } from '../common/exceptions/domain.exception';

@Injectable()
export class StockMovementService {
  constructor(private readonly prisma: PrismaService) {}

  // Registrar entrada de stock (IN)
  async registerIn(productId: string, quantity: number, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      // Validar existencia del producto
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new DomainException(
          DomainErrorCode.PRODUCT_NOT_FOUND,
          `Producto con ID ${productId} no encontrado`,
        );
      }

      // Validar cantidad positiva
      if (quantity <= 0) {
        throw new DomainException(
          DomainErrorCode.INVALID_QUANTITY,
          'La cantidad debe ser mayor a 0',
        );
      }

      // Crear movimiento de entrada
      const movement = await tx.stockMovement.create({
        data: {
          type: 'IN',
          quantity,
          reason,
          productId,
        },
      });

      // Actualizar stock del producto
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            increment: quantity,
          },
        },
      });

      return {
        movement,
        product: updatedProduct,
      };
    });
  }

  // Registrar salida de stock (OUT)
  async registerOut(productId: string, quantity: number, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      // Validar existencia del producto
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new DomainException(
          DomainErrorCode.PRODUCT_NOT_FOUND,
          `Producto con ID ${productId} no encontrado`,
        );
      }

      // Validar cantidad positiva
      if (quantity <= 0) {
        throw new DomainException(
          DomainErrorCode.INVALID_QUANTITY,
          'La cantidad debe ser mayor a  0',
        );
      }

      // Validar stock suficiente
      if (product.stock < quantity) {
        throw new DomainException(
          DomainErrorCode.INSUFFICIENT_STOCK,
          `Stock insuficiente. Stock actual: ${product.stock}, cantidad solicitada: ${quantity}`,
        );
      }

      // Crear movimiento de salida
      const movement = await tx.stockMovement.create({
        data: {
          type: 'OUT',
          quantity,
          reason,
          productId,
        },
      });

      // Actualizar stock del producto
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });

      return {
        movement,
        product: updatedProduct,
      };
    });
  }

  // Obtener historial de movimientos de un producto
  async getHistoryByProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new DomainException(
        DomainErrorCode.PRODUCT_NOT_FOUND,
        `Producto con ID ${productId} no encontrado`,
      );
    }

    return this.prisma.stockMovement.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            name: true,
            sku: true,
          },
        },
      },
    });
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { StockMovementService } from './stock-movement.service';
import { PrismaService } from '../prisma/prisma.service';
import { DomainException, DomainErrorCode } from '../common/exceptions/domain.exception';

describe('StockMovementService', () => {
  let service: StockMovementService;
  let prismaService: PrismaService;

  // Mock de producto para pruebas
  const mockProduct = {
    id: 'product-uuid',
    name: 'Producto Test',
    sku: 'TEST-001',
    stock: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock de movimiento de stock
  const mockMovement = {
    id: 'movement-uuid',
    type: 'IN' as const,
    quantity: 5,
    reason: 'Entrada de stock',
    createdAt: new Date(),
    productId: 'product-uuid',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockMovementService, PrismaService],
    }).compile();

    service = module.get<StockMovementService>(StockMovementService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerIn', () => {
    it('debería registrar una entrada de stock exitosamente', async () => {
      // Mockear el producto encontrado
      jest.spyOn(prismaService, 'product').mockReturnValue({
        findUnique: jest.fn().mockResolvedValue(mockProduct),
      } as any);

      // Mockear la transacción
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(mockProduct),
          update: jest.fn().mockResolvedValue({
            ...mockProduct,
            stock: mockProduct.stock + 5,
          }),
        },
        stockMovement: {
          create: jest.fn().mockResolvedValue(mockMovement),
        },
      };

      jest.spyOn(prismaService, '$transaction').mockImplementation(
        async (callback) => callback(mockTx),
      );

      const result = await service.registerIn(
        'product-uuid',
        5,
        'Entrada de stock',
      );

      expect(result).toEqual({
        movement: mockMovement,
        product: { ...mockProduct, stock: 15 },
      });

      expect(mockTx.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-uuid' },
      });
      expect(mockTx.stockMovement.create).toHaveBeenCalledWith({
        data: {
          type: 'IN',
          quantity: 5,
          reason: 'Entrada de stock',
          productId: 'product-uuid',
        },
      });
      expect(mockTx.product.update).toHaveBeenCalledWith({
        where: { id: 'product-uuid' },
        data: { stock: { increment: 5 } },
      });
    });

    it('debería lanzar PRODUCT_NOT_FOUND cuando el producto no existe', async () => {
      // Mockear la transacción con producto no encontrado
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(null),
          update: jest.fn(),
        },
        stockMovement: {
          create: jest.fn(),
        },
      };

      jest.spyOn(prismaService, '$transaction').mockImplementation(
        async (callback) => callback(mockTx),
      );

      await expect(
        service.registerIn('product-no-existe', 5, 'Entrada'),
      ).rejects.toThrow(
        new DomainException(
          DomainErrorCode.PRODUCT_NOT_FOUND,
          'Producto con ID product-no-existe no encontrado',
        ),
      );

      expect(mockTx.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-no-existe' },
      });
    });

    it('debería lanzar INVALID_QUANTITY cuando la cantidad es <= 0', async () => {
      // Mockear la transacción con cantidad inválida
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(mockProduct),
          update: jest.fn(),
        },
        stockMovement: {
          create: jest.fn(),
        },
      };

      jest.spyOn(prismaService, '$transaction').mockImplementation(
        async (callback) => callback(mockTx),
      );

      await expect(
        service.registerIn('product-uuid', 0, 'Entrada'),
      ).rejects.toThrow(
        new DomainException(
          DomainErrorCode.INVALID_QUANTITY,
          'La cantidad debe ser mayor a 0',
        ),
      );

      await expect(
        service.registerIn('product-uuid', -1, 'Entrada'),
      ).rejects.toThrow(
        new DomainException(
          DomainErrorCode.INVALID_QUANTITY,
          'La cantidad debe ser mayor a 0',
        ),
      );

      expect(mockTx.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-uuid' },
      });
    });
  });

  describe('registerOut', () => {
    it('debería registrar una salida de stock exitosamente', async () => {
      // Mockear la transacción para salida
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(mockProduct),
          update: jest.fn().mockResolvedValue({
            ...mockProduct,
            stock: mockProduct.stock - 3,
          }),
        },
        stockMovement: {
          create: jest.fn().mockResolvedValue({
            ...mockMovement,
            type: 'OUT',
            quantity: 3,
          }),
        },
      };

      jest.spyOn(prismaService, '$transaction').mockImplementation(
        async (callback) => callback(mockTx),
      );

      const result = await service.registerOut(
        'product-uuid',
        3,
        'Salida de stock',
      );

      expect(result).toEqual({
        movement: { ...mockMovement, type: 'OUT', quantity: 3 },
        product: { ...mockProduct, stock: 7 },
      });

      expect(mockTx.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-uuid' },
      });
      expect(mockTx.stockMovement.create).toHaveBeenCalledWith({
        data: {
          type: 'OUT',
          quantity: 3,
          reason: 'Salida de stock',
          productId: 'product-uuid',
        },
      });
      expect(mockTx.product.update).toHaveBeenCalledWith({
        where: { id: 'product-uuid' },
        data: { stock: { decrement: 3 } },
      });
    });

    it('debería lanzar PRODUCT_NOT_FOUND cuando el producto no existe', async () => {
      // Mockear la transacción con producto no encontrado
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(null),
          update: jest.fn(),
        },
        stockMovement: {
          create: jest.fn(),
        },
      };

      jest.spyOn(prismaService, '$transaction').mockImplementation(
        async (callback) => callback(mockTx),
      );

      await expect(
        service.registerOut('product-no-existe', 5, 'Salida'),
      ).rejects.toThrow(
        new DomainException(
          DomainErrorCode.PRODUCT_NOT_FOUND,
          'Producto con ID product-no-existe no encontrado',
        ),
      );

      expect(mockTx.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-no-existe' },
      });
    });

    it('debería lanzar INVALID_QUANTITY cuando la cantidad es <= 0', async () => {
      // Mockear la transacción con cantidad inválida
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(mockProduct),
          update: jest.fn(),
        },
        stockMovement: {
          create: jest.fn(),
        },
      };

      jest.spyOn(prismaService, '$transaction').mockImplementation(
        async (callback) => callback(mockTx),
      );

      await expect(
        service.registerOut('product-uuid', 0, 'Salida'),
      ).rejects.toThrow(
        new DomainException(
          DomainErrorCode.INVALID_QUANTITY,
          'La cantidad debe ser mayor a 0',
        ),
      );

      await expect(
        service.registerOut('product-uuid', -2, 'Salida'),
      ).rejects.toThrow(
        new DomainException(
          DomainErrorCode.INVALID_QUANTITY,
          'La cantidad debe ser mayor a 0',
        ),
      );

      expect(mockTx.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-uuid' },
      });
    });

    it('debería lanzar INSUFFICIENT_STOCK cuando no hay stock suficiente', async () => {
      // Mockear la transacción con stock insuficiente
      const mockTx = {
        product: {
          findUnique: jest.fn().mockResolvedValue(mockProduct),
          update: jest.fn(),
        },
        stockMovement: {
          create: jest.fn(),
        },
      };

      jest.spyOn(prismaService, '$transaction').mockImplementation(
        async (callback) => callback(mockTx),
      );

      await expect(
        service.registerOut('product-uuid', 15, 'Salida'),
      ).rejects.toThrow(
        new DomainException(
          DomainErrorCode.INSUFFICIENT_STOCK,
          'Stock insuficiente. Stock actual: 10, cantidad solicitada: 15',
        ),
      );

      expect(mockTx.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-uuid' },
      });
    });
  });
});
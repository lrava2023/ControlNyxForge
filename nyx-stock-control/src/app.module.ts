import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { StockMovementModule } from './stock-movement/stock-movement.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, ProductModule, StockMovementModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

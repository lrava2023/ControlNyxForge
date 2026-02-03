import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global de DTOs
  // whitelist: true - Elimina campos no decorados en el DTO
  // forbidNonWhitelisted: true - Lanza error si se envían campos extra
  // transform: true - Convierte tipos primitivos automáticamente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Registrar el filtro de excepciones globalmente
  app.useGlobalFilters(new DomainExceptionFilter());
  
  // Registrar el interceptor de respuestas globalmente
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // Configurar prefijo global de API
  app.setGlobalPrefix('api/v1');
  
  // Configurar Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('Nyx Stock Control API')
    .setDescription('API para el control de inventario y movimientos de stock')
    .setVersion('1.0')
    .addTag('products', 'Gestión de productos')
    .addTag('stock', 'Gestión de movimientos de stock')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

# Nyx Stock Control API

API REST para control de inventario y movimientos de stock. Sistema backend desarrollado con NestJS para gestión de productos y seguimiento de entradas/salidas de stock.

## Tecnologías

- **Framework**: NestJS 11.0.1
- **ORM**: Prisma 7.3.0
- **Base de datos**: PostgreSQL
- **Documentación**: Swagger/OpenAPI
- **Pruebas**: Jest
- **Validación**: class-validator, class-transformer

## Arquitectura

### Estructura de módulos

```
src/
├── app.module.ts              # Módulo raíz
├── main.ts                    # Punto de entrada
├── common/                    # Componentes comunes
│   ├── dto/                   # DTOs compartidos
│   ├── exceptions/            # Excepciones de dominio
│   ├── filters/               # Filtros de excepciones
│   └── interceptors/          # Interceptores globales
├── prisma/                    # Configuración de Prisma
├── product/                   # Módulo de productos
│   ├── product.module.ts
│   ├── product.controller.ts
│   ├── product.service.ts
│   └── dto/                   # DTOs de productos
├── stock-movement/            # Módulo de movimientos de stock
│   ├── stock-movement.module.ts
│   ├── stock-movement.controller.ts
│   ├── stock-movement.service.ts
│   └── dto/                   # DTOs de movimientos
└── health/                    # Módulo de health check
    ├── health.module.ts
    └── health.controller.ts
```

### Patrones utilizados

- **Inyección de dependencias**: NestJS DI
- **DTOs**: Transferencia de datos entre capas
- **Filtros de excepciones**: Manejo centralizado de errores
- **Interceptores**: Procesamiento de respuestas
- **Validación**: Validación automática de DTOs

## Convenciones de API

### Respuestas exitosas

Todas las respuestas exitosas siguen el formato:

```json
{
  "data": <contenido_original>
}
```

Ejemplo:
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Laptop Gamer",
    "sku": "LAP-GAMER-001",
    "stock": 25
  }
}
```

### Errores

Formato de respuestas de error:

```json
{
  "statusCode": 400,
  "error": "PRODUCT_NOT_FOUND",
  "message": "Producto con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products/123e4567-e89b-12d3-a456-426614174000"
}
```

**Códigos de error de dominio:**
- `PRODUCT_NOT_FOUND`: Producto no encontrado
- `INSUFFICIENT_STOCK`: Stock insuficiente
- `INVALID_QUANTITY`: Cantidad inválida

## Versionado de API

La API utiliza versionado mediante prefijo de ruta:

**Prefijo global**: `/api/v1`

Todos los endpoints están disponibles bajo este prefijo:
- `GET /api/v1/health`
- `GET /api/v1/products`
- `POST /api/v1/stock/in`

## Endpoints

### Health Check

```http
GET /api/v1/health
```

Respuesta:
```json
{
  "data": {
    "status": "ok"
  }
}
```

### Productos

```http
GET    /api/v1/products              # Listar productos
POST   /api/v1/products              # Crear producto
GET    /api/v1/products/:id          # Obtener producto por ID
PUT    /api/v1/products/:id          # Actualizar producto
DELETE /api/v1/products/:id          # Eliminar lógicamente producto
GET    /api/v1/products/:id/stock    # Obtener stock de producto
GET    /api/v1/products/with-stock   # Listar productos con stock
```

### Movimientos de Stock

```http
POST /api/v1/stock/in                # Registrar entrada de stock
POST /api/v1/stock/out               # Registrar salida de stock
GET  /api/v1/stock/products/:id/movements  # Historial de movimientos
```

## Instalación y ejecución

### Requisitos previos

- Node.js 18+
- PostgreSQL
- npm o yarn

### Configuración

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd nyx-stock-control
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` basado en `.env.example`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nyx_stock_control"
PORT=3000
```

4. Ejecutar migraciones:
```bash
npx prisma migrate dev
```

### Desarrollo

```bash
# Iniciar en modo desarrollo
npm run start:dev

# Iniciar en modo producción
npm run build
npm run start:prod
```

### Pruebas

```bash
# Pruebas unitarias
npm run test

# Pruebas e2e
npm run test:e2e

# Cobertura de pruebas
npm run test:cov
```

## Documentación Swagger

La documentación de la API está disponible en:

```
http://localhost:3000/api
```

Incluye:
- Descripción de todos los endpoints
- Esquemas de peticiones y respuestas
- Ejemplos de uso
- Códigos de estado HTTP

## Estructura de base de datos

### Tablas principales

**Product**:
- id (UUID)
- name (string)
- description (string, nullable)
- sku (string, unique)
- stock (integer, default: 0)
- isActive (boolean, default: true)
- createdAt, updatedAt (timestamps)

**StockMovement**:
- id (UUID)
- type (enum: IN|OUT)
- quantity (integer)
- reason (string, nullable)
- productId (foreign key)
- createdAt (timestamp)

## Contribución

1. Crear una rama para tu feature: `git checkout -b feature/NuevaFeature`
2. Hacer commit de los cambios: `git commit -m 'Añade nueva feature'`
3. Subir a la rama: `git push origin feature/NuevaFeature`
4. Crear un Pull Request

## Licencia

[Nombre de la licencia]
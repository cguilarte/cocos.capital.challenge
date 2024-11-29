<h1 align="left">Setup - Coco.capital - API - Challenge</h1>

## Ejecutar con docker

#### Pre-requisitos:
- docker
- docker compose

#### Paso:
1. Ejecutar `docker compose up`.

#### Como usarlo:
- Ir a `http://localhost:9001/api`.
- También puede probar endpoints con su cliente preferido. (Postman/Insomnio).
- Dentro del repro esta un=a collección de prueba en postman `Cocos.capital - API.postman_collection.json`

## Ejecutar modo local con npm

## Tabla de contenido

* [Instalación](#instalación)
* [Run dev](#dev)
* [Environment](#environment)
* [Building](#building)
* [Testing](#testing)
* [Linting](#linting)

## Instalación

```bash
nvm install 22.11.0
nvm use
npm install
```

## Environment
1. Reemplace el archivo `.env.example` con `.env`. Y configurar la información según el entorno.

## Run dev

```bash
npm run start:dev
```

## Building

```bash
npm run build
```

## Testing

### Jest with Testing Library

```bash
npm run test
```

## Linting

Run the linter

```bash
npm run lint
```

Fix lint issues automatically

```bash
npm run lint:fix
```

## Actualización de la base de datos
Se agrego indeces a las siguientes tablas para una mejor busqueda y mejor performace

#### Índices de clave externa
`CREATE INDEX idx_orders_instrument_id ON orders(instrumentId);
CREATE INDEX idx_orders_user_id ON orders(userId);
CREATE INDEX idx_marketdata_instrument_id ON marketdata(instrumentId);`

#### Columnas comúnmente consultadas
`CREATE INDEX idx_orders_datetime ON orders(datetime);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_marketdata_date ON marketdata(date);`

#### Índices compuestos para posibles escenarios de unión y filtrado
`CREATE INDEX idx_orders_instrument_user ON orders(instrumentId, userId);
CREATE INDEX idx_marketdata_instrument_date ON marketdata(instrumentId, date);`

# Datos de la api

- GET `http://localhost:9001/api/1/portfolio`
- GET  `http://localhost:9001/api/instruments?query=Exportadora`
- POST `http://localhost:9001/api/order`

#### Ejemplo de orden de compra (BUY):

```
{
    "userId": 1,
    "instrumentId": 31,
    "side": "BUY",
    "type": "MARKET",
    "quantity": 9
}
```

#### Ejemplo de orden de venta (SELL):

```
{
    "userId": 1,
    "instrumentId": 38,
    "side": "SELL",
    "type": "LIMIT",
    "quantity": 2,
    "price": 400
}
```


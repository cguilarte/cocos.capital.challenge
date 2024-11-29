import express from "express";

import { portfolioController, searchController, orderController } from "../dependencies";
import { orderSchema, portfolioSchema, querySchema } from "../validations";
import { validate } from "../../../shared/infrastructure/validationMiddleware";

const Routers = express.Router();

Routers.get(
  "/:userId/portfolio",
  validate(portfolioSchema, "params"),
  portfolioController.getPortfolio.bind(portfolioController)
);

Routers.get(
  "/instruments",
  validate(querySchema, "query"),
  searchController.searchInstruments.bind(searchController)
);

Routers.post(
  "/order",
  validate(orderSchema),
  orderController.createOrder.bind(orderController)
);

export { Routers };

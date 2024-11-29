import { logger } from "../../shared/infrastructure/dependencies";

import { PostgresRepository } from "./repository/postgres-repository";
import { PortfolioCase } from "../application/portfolio-usecase";
import { SearchCase } from "../application/search-usecase";
import { OrderCase } from "../application/order-usecase";
import { PortfolioController } from "./rest-api/portfolio-controller";
import { SearchController } from "./rest-api/search-controller";
import { OrderController } from "./rest-api/order-controller";

// Rpository
const repository = new PostgresRepository();

// Case use
const portfolioService = new PortfolioCase(
  repository
)

const searchService = new SearchCase(
  repository
)

const orderService = new OrderCase(
  portfolioService,
  repository
)


// Controllers
export const portfolioController = new PortfolioController(portfolioService, logger);
export const searchController = new SearchController(searchService, logger);
export const orderController = new OrderController(orderService, logger);

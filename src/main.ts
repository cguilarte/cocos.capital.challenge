import "./shared/infrastructure/load-env-vars";

import bodyParser from "body-parser";
import express from "express";

import { config } from "./shared/infrastructure/config";
import { Routers } from "./app/infrastructure/rest-api/router";

function bootstrap() {
  const app = express();

  app.use(bodyParser.json());
  app.use("/api", Routers);

  const { PORT, APPLICATION_NAME, HOST_SERVER } = config.server;

  app.listen(PORT, () => {
    console.log(
      `✅ ${APPLICATION_NAME} running on: ${HOST_SERVER}`
    );

  });
}

bootstrap();

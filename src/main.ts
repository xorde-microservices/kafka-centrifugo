/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-*
 **/

import * as dotenv from "dotenv";
dotenv.config();

export const toLocalhost = (url: string) => {
  // https://regex101.com/r/vIE8X1/1
  const re =
    /:\/\/(\[::1]|127\.[012]?[0-9]{0,2}\.[012]?[0-9]{0,2}\.[012]?[0-9]{0,2})/gi;
  return url.replace(re, "://localhost");
};

import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app/app.module";
import { ConfigService } from "@nestjs/config";
import { kafkaConfig } from "./config/kafka.config";

const logger = new Logger("Bootstrap");

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === "production"
        ? ["log", "warn", "error"]
        : ["log", "debug", "verbose", "warn", "error"],
  });

  const config = app.get(ConfigService);
  app.connectMicroservice(kafkaConfig().kafka);

  await app.startAllMicroservices();
  await app.listen(config.get<number>("app.port"));
  logger.log(`App: ${toLocalhost(await app.getUrl())}`);
}

bootstrap();

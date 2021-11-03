/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "../config/env.schema";
import { appConfig } from "../config/app.config";
import { centrifugoConfig } from "../config/centrifugo.config";
import { kafkaConfig } from "../config/kafka.config";
import { CentrifugoModule } from "../centrifugo/centrifugo.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envSchema,
      isGlobal: true,
      load: [appConfig, centrifugoConfig, kafkaConfig],
    }),
    CentrifugoModule,
  ],
})
export class AppModule {}

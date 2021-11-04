/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

import { Module } from "@nestjs/common";
import { CentrifugoService } from "./centrifugo.service";
import { KafkaModule } from "../kafka/kafka.module";

@Module({
  imports: [KafkaModule],
  providers: [CentrifugoService],
  exports: [CentrifugoService],
})
export class CentrifugoModule {}

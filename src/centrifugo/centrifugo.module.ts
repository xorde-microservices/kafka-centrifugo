/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

import { Module } from "@nestjs/common";
import { CentrifugoController } from "./centrifugo.controller";
import { CentrifugoService } from "./centrifugo.service";

@Module({
  imports: [],
  controllers: [CentrifugoController],
  providers: [CentrifugoService],
  exports: [CentrifugoService],
})
export class CentrifugoModule {}

/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

import { Controller } from "@nestjs/common";
import { CentrifugoService } from "./centrifugo.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class CentrifugoController {
  constructor(private service: CentrifugoService) {}

  @MessagePattern("binance.stream")
  public async sendMail(@Payload() payload: any): Promise<boolean> {
    console.log("%o", payload);
    return true;
  }
}

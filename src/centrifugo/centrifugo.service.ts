/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

import { Injectable, Logger } from "@nestjs/common";
import { Client, ClientKafka } from "@nestjs/microservices";
import { kafkaConfig } from "../config/kafka.config";
import { centrifugoConfig } from "../config/centrifugo.config";
import { Consumer } from "@nestjs/microservices/external/kafka.interface";
import Centrifuge from "centrifuge";

interface ServiceStats {
  events: number;
  rateEvents?: number;
  errors: number;
  rateErrors?: number;
  skipped: number;
  rateSkipped?: number;
  memory?: NodeJS.MemoryUsage;
}

@Injectable()
export class CentrifugoService {
  private readonly logger = new Logger(this.constructor.name);
  private topics = kafkaConfig().kafka.topics.split(",")

  @Client(kafkaConfig().kafka)
  client: ClientKafka;
  consumer: Consumer;

  centrifuge: Centrifuge;

  constructor() {
    this.logger.log(`Kafka topics: ${this.topics.join(",")}`);
  }

  async onModuleInit() {
    this.centrifuge = new Centrifuge(centrifugoConfig().centrifugo.host);
    this.centrifuge.setToken(centrifugoConfig().centrifugo.token);
    this.centrifuge.connect();

  }

  publish(channel: string, message: any) {
    this.logger.log(`${JSON.stringify({channel, message})}`)
    this.centrifuge.publish(channel, message).catch((e) => this.logger.error(e.message));
  }
}

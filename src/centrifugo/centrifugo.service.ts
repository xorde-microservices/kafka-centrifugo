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

  constructor() {
    this.logger.log(`Kafka topics: ${this.topics.join(",")}`);
  }

  async onModuleInit() {
    console.log("%o", this.client);
    // this.consumer = this.client.consumer;
  }
}

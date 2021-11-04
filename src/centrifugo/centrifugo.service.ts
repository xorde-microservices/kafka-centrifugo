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
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { KafkaService } from "../kafka/kafka.service";

const j = (s) => JSON.stringify(s);

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
  private readonly config = centrifugoConfig().centrifugo;
  private readonly logger = new Logger(this.constructor.name);
  private topics = kafkaConfig().kafka.topics.split(",");
  private stats: ServiceStats = {events: 0, errors: 0, skipped: 0};

  constructor(
    private readonly kafka: KafkaService,
  ) {
    this.logger.log(`Kafka topics: [${this.topics.join(",")}]`);
  }

  async onModuleInit() {
    this.logger.log(`Centrifugo host ${centrifugoConfig().centrifugo.host}`);

    setInterval(() => {
      this.stats.memory = process.memoryUsage();
      this.logger.log(j(this.stats));
    }, 1000 * 60);

    this.kafka.consumerHandler = (payload) => {
      const { topic:channel, message:data } = payload;
      this.publish(channel, data);
    }
  }

  public async publish(channel: string, data: any) {
    const body = {
      method: "publish",
      params: { channel, data },
    };
    return this.send(body);
  }

  public async send(body: any): Promise<any> {
    this.stats.events++;
    const options: AxiosRequestConfig = {
      headers: {
        Authorization: `apikey ${centrifugoConfig().centrifugo.apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: centrifugoConfig().centrifugo.timeout,
    };

    const response = await axios
      .post(centrifugoConfig().centrifugo.host, body, options)
      .catch((e) => {
        this.logger.error(e);
      })
      .then((r: AxiosResponse) => {
        if (r?.data?.error) {
          this.stats.errors++;
          this.logger.error(`Centrifugo: ${r.data}`);
        } else {
          return r;
        }
      });
  }
}

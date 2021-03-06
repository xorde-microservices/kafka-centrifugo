/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

import { Injectable, Logger } from "@nestjs/common";
import { kafkaConfig } from "../config/kafka.config";
import { centrifugoConfig } from "../config/centrifugo.config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { KafkaService } from "../kafka/kafka.service";
import { v } from "../common/log";

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

const INTERVAL_MSEC = 1000;

@Injectable()
export class CentrifugoService {
  private readonly config = centrifugoConfig().centrifugo;
  private readonly logger = new Logger(this.constructor.name);
  private stats: ServiceStats = {events: 0, errors: 0, skipped: 0};
  private channels = [];
  private lastIntervalMessage = [];
  private intervals = [];

  constructor(
    private readonly kafka: KafkaService,
  ) {
    this.logger.log("Centrifugo host: " + centrifugoConfig().centrifugo.host)
    this.intervals = this.config.intervals?.split(",").map(m => Number(m));
    this.logger.log("Centrifugo intervals: " + v(this.intervals));
  }

  async onModuleInit() {
    setInterval(() => {
      this.stats.memory = process.memoryUsage();
      this.logger.log(j(this.stats));
    }, 1000 * 60);

    this.kafka.consumerHandler = (payload) => {
      const { topic:channel, message } = payload;
      const { key, value } = message;
      const data = { key, value: value.toString() };
      if (!this.channels.includes(channel)) {
        // this will fire log message as soon as a message is published in new channel
        this.logger.log(`Channel introduced ${channel}`);
        this.channels.push(channel);
      }

      this.intervals.forEach((e) => {
        if (Date.now() - (this.lastIntervalMessage[channel]?.[e] || 0) > e) {
          this.publish({ channel: channel + `@${e}`, data });
          if (!this.lastIntervalMessage[channel]) {
            this.lastIntervalMessage[channel] = [];
          }
          this.lastIntervalMessage[channel][e] = Date.now();
        }
      });

      this.publish({ channel, data });
    }
  }

  public async publish(params: { channel: string, data: any }) {
    const body = {
      method: "publish",
      params,
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
        this.logger.error("Post error: " + v(e));
      })
      .then((r: AxiosResponse) => {
        if (r?.data?.error) {
          this.stats.errors++;
          this.logger.error("Response error: " + v(r.data));
        } else {
          return r;
        }
      });
  }
}

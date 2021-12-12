/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2021
 **/

import { KafkaOptions, Transport } from "@nestjs/microservices";
import { defaults } from "./config.defaults";

export interface ExtendedKafkaOptions {
  topics: string;
}

export interface IKafkaOptions {
  kafka: KafkaOptions & ExtendedKafkaOptions;
}

export const kafkaConfig = (): IKafkaOptions => ({
  kafka: {
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID,
      },
      client: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: process.env.KAFKA_BROKERS.split(","),
        ssl: process.env.KAFKA_SSL === "true",
        sasl: {
          mechanism: "plain",
          username: process.env.KAFKA_USERNAME,
          password: process.env.KAFKA_PASSWORD,
        },
      },
    },
    topics: process.env.KAFKA_TOPICS,
  },
});

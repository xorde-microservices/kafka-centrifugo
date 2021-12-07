import { Injectable, Logger } from "@nestjs/common";
import { Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";
import { kafkaConfig } from "../config/kafka.config";

const j = (s) => JSON.stringify(s);

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly config = kafkaConfig().kafka;
  private readonly topics = kafkaConfig().kafka.topics.split(",");
  private readonly subchannel = kafkaConfig().kafka.subchannel;
  private kafka: Kafka;
  private consumer: Consumer;

  public consumerHandler: (payload: EachMessagePayload) => void;

  KafkaLogCreator =
    (logLevel) =>
      ({ namespace, level, label, log }) => {
        const { timestamp, logger, message, ...others } = log;
        switch (level) {
          case logLevel.ERROR:
            this.logger.error(
              `${label} [Kafka:${namespace}] ${message} ${j(others)}`,
            );
            break;
          default:
            this.logger.log(
              `${label} [Kafka:${namespace}] ${message} ${j(others)}`,
            );
        }
      };

  constructor() {
    this.kafka = new Kafka({
      logCreator: this.KafkaLogCreator,
      ...this.config.options.client
    });

    this.consumer = this.kafka.consumer({
      ...this.config.options.consumer
    });
  }

  async onModuleInit() {
    await this.consumer.connect().then(async () => {
      for (const topic of this.topics) {
        await this.consumer.subscribe({
          topic,
        });
      }
      await this.consumer.run({
        eachMessage: async (payload) => {
          if (this.subchannel) {
            // parse message value and get value of this.subchannel property:
            const topicSuffix = JSON.parse(payload.message.value.toString())[this.subchannel];
            if (topicSuffix) {
              payload.topic = payload.topic + "." + topicSuffix;
            }
          }
          this.consumerHandler(payload);
        },
      });
    });
  }
}

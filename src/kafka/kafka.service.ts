import { Injectable, Logger } from "@nestjs/common";
import { Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";
import { kafkaConfig } from "../config/kafka.config";
import { KafkaTopics } from "./kafka.interface";
import { v } from "../common/log";
import * as R from "rambda";


const j = (s) => JSON.stringify(s);

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly config = kafkaConfig().kafka;
  private readonly topics: KafkaTopics = this.parseTopics(kafkaConfig().kafka.topics);
  private kafka: Kafka;
  private consumer: Consumer;

  public consumerHandler: (payload: EachMessagePayload) => void;

  KafkaLogCreator =
    (logLevel) => {
      return ({ namespace, level, label, log }) => {
        const { timestamp, logger, message, ...others } = log;
        switch (level) {
          case logLevel.ERROR:
            this.logger.error(
              `${ label } [Kafka:${ namespace }] ${ message } ${ j(others) }`
            );
            break;
          default:
            this.logger.log(
              `${ label } [Kafka:${ namespace }] ${ message } ${ j(others) }`
            );
        }
      };
    };

  /* parse topic string into array of KafkaTopic
  * accepts topics string in format:
  * topic1[user=userId,subchannel=test];topic2[subchannel=test]
  *  */
  parseTopics(topics: string): KafkaTopics {
    const re = /(?<key>[^=\[,]+)=(?<value>[^,\]]+)/g;
    const topicElements = topics.split(";");
    return topicElements.map((element) => {
        const params = [...element.matchAll(re)];
        const topic = {
          name: element.split("[")[0],
          subchannel: params.filter(f => f[1] == "subchannel")[0]?.[2],
          userchannel: params.filter(f => f[1] == "user")[0]?.[2],
        };
        Object.keys(topic).forEach(key => topic[key] === undefined ? delete topic[key] : {});
        return topic;
      }
    );
  };

  constructor() {
    this.logger.log("Topics: " + v(this.topics));

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
          topic: topic.name,
        });
      }
      await this.consumer.run({
        eachMessage: async (payload) => {
          const topic = this.topics.find(f => f.name == payload.topic);

          // if subchannel is configured, then add channel suffix to it:
          if (topic.subchannel) {
            const topicSuffix = JSON.parse(payload.message.value.toString())[topic.subchannel];
            payload.topic = payload.topic + "." + topicSuffix;
          }

          // if userchannel is configured, then add user-channel suffix to it;
          if (topic.userchannel) {
            const topicSuffix = JSON.parse(payload.message.value.toString())[topic.subchannel];
            payload.topic = payload.topic + "#" + topicSuffix;
          }

          this.logger.verbose("Message: " + v(R.pick(["topic", "key", "timestamp"], payload)));
          this.consumerHandler(payload);
        },
      });
    });
  }
}

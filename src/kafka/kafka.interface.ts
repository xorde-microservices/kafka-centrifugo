export interface KafkaTopic {
  name: string;
  subchannel?: string;
  userchannel?: string;
}

export type KafkaTopics = KafkaTopic[];


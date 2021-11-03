## Installation

```bash
$ yarn
```

## Running locally

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Running in Docker

```bash
git clone https://github.com/xorde-microservices/kafka-centrifugo
cd kafka-centrifugo
docker build --tag kafka-centrifugo .
docker run -d --name kafka-centrifugo \
  -e KAFKA_BROKER=<brokers> \
  -e KAFKA_TOPICS=topic-1,topic-2 \
  -e CENTRIFUGO_HOST=<host> \
  -e CENTRIFUGO_TOKEN=<token>
  kafka-centrifugo
```

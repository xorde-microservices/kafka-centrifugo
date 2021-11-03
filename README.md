## Installation

```bash
$ npm install
```

## Running locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running in Docker

```bash
git clone https://github.com/xorde-microservices/binance-kafka
cd binance-kafka
docker build --tag binance-kafka .
docker run -d --name binance-kafka \
  -e KAFKA_BROKER=localhost:9092 \
  -e KAFKA_TOPIC=binance-trades \
  -e BINANCE_PAIRS='XBT/USDT,ETH/USDT' \
  binance-kafka
```
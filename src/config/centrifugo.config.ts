/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

export interface ICentrifugoConfigOptions {
  host: string;
  token: string;
}

interface ICentrifugoConfig {
  centrifugo: ICentrifugoConfigOptions;
}

export const centrifugoConfig = (): ICentrifugoConfig => ({
  centrifugo: {
    host: process.env.CENTRIFUGO_HOST,
    token: process.env.CENTRIFUGO_TOKEN,
  },
});

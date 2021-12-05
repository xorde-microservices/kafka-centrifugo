/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/


const transformURL = (url: string): string => {
  if (url.length > 0) {
    const path = "/api";

    if (url[url.length - 1] === "/") {
      url = url.slice(0, url.length - 1);
    }

    if (url.indexOf(path, url.length - path.length) === -1) {
      url = url + path;
    } else {
      url = url;
    }
  }
  return url;
};

export interface ICentrifugoConfigOptions {
  host: string;
  apiKey: string;
  timeout: number;
}

interface ICentrifugoConfig {
  centrifugo: ICentrifugoConfigOptions;
}

export const centrifugoConfig = (): ICentrifugoConfig => ({
  centrifugo: {
    host: transformURL(process.env.CENTRIFUGO_HOST),
    apiKey: process.env.CENTRIFUGO_APIKEY,
    timeout: Number(process.env.CENTRIFUGO_TIMEOUT),
  },
});

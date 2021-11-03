/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

export interface IAppConfigOptions {
  name: string;
  code: string;
  port: number;
}

interface IAppConfig {
  app: IAppConfigOptions;
}

export const appConfig = (): IAppConfig => ({
  app: {
    name: process.env.APP_NAME,
    code: process.env.APP_CODE,
    port: Number(process.env.APP_PORT),
  },
});

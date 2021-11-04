/**
 * @format
 * Copyright (C) Xorde Technologies
 * All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Xander Tovski, 2019-2020
 **/

import * as Joi from "joi";
import { defaults } from "./config.defaults";

/**
 * Environment variables validation schema.
 */
export const envSchema = Joi.object({
  // app
  APP_NAME: Joi.string().allow("").default(defaults.APP_NAME),
  APP_CODE: Joi.string().allow("").default(defaults.APP_CODE),
  APP_PORT: Joi.number().allow("").default(defaults.APP_PORT),

  // kafka
  KAFKA_TOPICS: Joi.string().required(),
  KAFKA_SSL: Joi.boolean().allow("").default(defaults.KAFKA_SSL),
  KAFKA_CLIENT_ID: Joi.string().allow(""),
  KAFKA_GROUP_ID: Joi.string().allow("").default(defaults.KAFKA_GROUP_ID),
  KAFKA_USERNAME: Joi.string().allow(""),
  KAFKA_PASSWORD: Joi.string().allow(""),
  KAFKA_BROKERS: Joi.string().required(),

  // centrifugo
  CENTRIFUGO_HOST: Joi.string().required(),
  CENTRIFUGO_APIKEY: Joi.string().required(),
  CENTRIFUGO_TIMEOUT: Joi.number()
    .allow("")
    .default(defaults.CENTRIFUGO_TIMEOUT),
});

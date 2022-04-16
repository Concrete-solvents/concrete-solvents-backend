import * as joi from 'joi';

export default joi.object({
  NODE_ENV: joi.string().valid('dev', 'prod', 'test'),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.string().required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_DATABASE: joi.string().required(),
  ORIGIN: joi.string().required(),
  JWT_SECRET: joi.string().required(),
});

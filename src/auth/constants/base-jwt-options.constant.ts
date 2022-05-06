// Libraries
import { CookieOptions } from 'express';

const MAX_JWT_AGE = 24 * 60 * 60 * 365;

const BASE_JWT_OPTION: CookieOptions = {
  maxAge: MAX_JWT_AGE,
  sameSite: 'none',
  secure: true,
  path: '/',
  httpOnly: true,
};

export { BASE_JWT_OPTION };

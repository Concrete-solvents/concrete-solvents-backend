import { v4 as uuidv4 } from 'uuid';

function generateRandomCode(): string {
  return uuidv4().split('-')[0];
}

export { generateRandomCode };

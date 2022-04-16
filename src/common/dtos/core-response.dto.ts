// Common
import { CustomError } from '@Common/enums/custom-errors';

export class CoreResponse {
  error?: CustomError;

  isSuccess: boolean;
}

// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class CreateEmailCommand extends BaseCommand {
  readonly emailValue: string;

  constructor(props: CreateEmailCommand) {
    super();
    this.emailValue = props.emailValue;
  }
}

export { CreateEmailCommand };

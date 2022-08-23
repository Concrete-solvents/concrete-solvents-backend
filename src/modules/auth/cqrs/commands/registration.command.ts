// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class RegistrationCommand extends BaseCommand {
  readonly login: string;
  readonly email: string;
  readonly password: string;
  readonly language: string;

  constructor(props: RegistrationCommand) {
    super();
    this.login = props.login.toLowerCase();
    this.email = props.email.toLowerCase();
    this.language = props.language;
    this.password = props.password;
  }
}

export { RegistrationCommand };

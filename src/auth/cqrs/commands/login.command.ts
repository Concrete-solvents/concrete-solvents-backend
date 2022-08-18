// Libs
import { BaseCommand } from '../../../libs/base-classes/base-command';

class LoginCommand extends BaseCommand {
  readonly login: string;
  readonly password: string;

  constructor(props: LoginCommand) {
    super();
    this.login = props.login.toLowerCase();
    this.password = props.password;
  }
}

export { LoginCommand };

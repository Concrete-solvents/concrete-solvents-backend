// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class UpdateUserInfoCommand extends BaseCommand {
  readonly userId: number;
  readonly username?: string;
  readonly description?: string;
  readonly avatarUrl?: string;
  readonly email?: string;
  readonly isVerified?: boolean;
  readonly login?: string;

  constructor(props: UpdateUserInfoCommand) {
    super();
    this.userId = props.userId;
    this.description = props.description;
    this.username = props.username;
    this.avatarUrl = props.avatarUrl;
    this.email = props.email;
    this.isVerified = props.isVerified;
    this.login = props.login;
  }
}

export { UpdateUserInfoCommand };

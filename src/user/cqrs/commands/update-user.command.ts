// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class UpdateUserCommand extends BaseCommand {
  readonly username?: string;
  readonly newPassword?: string;
  readonly oldPassword?: string;
  readonly avatarUrl?: string;
  readonly email?: string;
  readonly userId: number;

  constructor(props: UpdateUserCommand) {
    super();
    this.email = props.email;
    this.avatarUrl = props.avatarUrl;
    this.newPassword = props.newPassword;
    this.oldPassword = props.oldPassword;
    this.username = props.username;
    this.userId = props.userId;
  }
}

export { UpdateUserCommand };

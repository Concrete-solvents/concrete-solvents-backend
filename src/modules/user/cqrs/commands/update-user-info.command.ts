// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class UpdateUserInfoCommand extends BaseCommand {
  readonly userId: number;
  readonly username?: string;
  readonly description?: string;
  readonly avatarUrl?: string;

  constructor(props: UpdateUserInfoCommand) {
    super();
    this.userId = props.userId;
    this.description = props.description;
    this.username = props.username;
    this.avatarUrl = props.avatarUrl;
  }
}

export { UpdateUserInfoCommand };

// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class DeleteFriendCommand extends BaseCommand {
  readonly userId: number;
  readonly userToDeleteId: number;

  constructor(props: DeleteFriendCommand) {
    super();

    this.userToDeleteId = props.userToDeleteId;
    this.userId = props.userId;
  }
}

export { DeleteFriendCommand };

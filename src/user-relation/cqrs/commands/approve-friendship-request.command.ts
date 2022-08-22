// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class ApproveFriendshipRequestCommand extends BaseCommand {
  readonly toUserId;
  readonly fromUserId;

  constructor(props: ApproveFriendshipRequestCommand) {
    super();

    this.toUserId = props.toUserId;
    this.fromUserId = props.fromUserId;
  }
}

export { ApproveFriendshipRequestCommand };

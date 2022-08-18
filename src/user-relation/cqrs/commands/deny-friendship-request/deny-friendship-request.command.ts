import { BaseCommand } from '../../../../libs/base-classes/base-command';

class DenyFriendshipRequestCommand extends BaseCommand {
  readonly userId: number;
  readonly fromUserId: number;

  constructor(props: DenyFriendshipRequestCommand) {
    super();

    this.userId = props.userId;
    this.fromUserId = props.fromUserId;
  }
}

export { DenyFriendshipRequestCommand };

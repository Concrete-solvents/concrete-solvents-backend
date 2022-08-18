import { BaseCommand } from '../../../../libs/base-classes/base-command';

class CancelFriendshipRequestCommand extends BaseCommand {
  readonly userId: number;
  readonly toUserId: number;

  constructor(props: CancelFriendshipRequestCommand) {
    super();

    this.userId = props.userId;
    this.toUserId = props.toUserId;
  }
}

export { CancelFriendshipRequestCommand };

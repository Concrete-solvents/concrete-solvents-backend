import { BaseCommand } from '../../../../libs/base-classes/base-command';

class SendFriendshipRequestCommand extends BaseCommand {
  readonly fromUserId;
  readonly toUserId;

  constructor(props: SendFriendshipRequestCommand) {
    super();

    this.fromUserId = props.fromUserId;
    this.toUserId = props.toUserId;
  }
}

export { SendFriendshipRequestCommand };

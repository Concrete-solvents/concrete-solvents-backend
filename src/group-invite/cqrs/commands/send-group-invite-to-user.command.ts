import { BaseCommand } from '../../../libs/base-classes/base-command';

class SendGroupInviteToUserCommand extends BaseCommand {
  readonly sentByUserId: number;
  readonly sentToUserId: number;
  readonly groupId: number;

  constructor(props: SendGroupInviteToUserCommand) {
    super();
    this.sentByUserId = props.sentByUserId;
    this.sentToUserId = props.sentToUserId;
    this.groupId = props.groupId;
  }
}

export { SendGroupInviteToUserCommand };

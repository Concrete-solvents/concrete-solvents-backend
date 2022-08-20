// Libs
import { BaseCommand } from '../../../libs/base-classes/base-command';

class RejectGroupInviteToUserCommand extends BaseCommand {
  readonly userId: number;
  readonly inviteId: number;

  constructor(props: RejectGroupInviteToUserCommand) {
    super();
    this.inviteId = props.inviteId;
    this.userId = props.userId;
  }
}

export { RejectGroupInviteToUserCommand };

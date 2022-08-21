// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class AcceptGroupInviteToUserCommand extends BaseCommand {
  readonly inviteId: number;
  readonly userId: number;

  constructor(props: AcceptGroupInviteToUserCommand) {
    super();
    this.inviteId = props.inviteId;
    this.userId = props.userId;
  }
}

export { AcceptGroupInviteToUserCommand };

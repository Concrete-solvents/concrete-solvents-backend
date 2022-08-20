import { BaseCommand } from '../../../libs/base-classes/base-command';

class CancelGroupInviteToUserCommand extends BaseCommand {
  readonly inviteId: number;
  readonly userId: number;

  constructor(props: CancelGroupInviteToUserCommand) {
    super();
    this.inviteId = props.inviteId;
    this.userId = props.userId;
  }
}

export { CancelGroupInviteToUserCommand };

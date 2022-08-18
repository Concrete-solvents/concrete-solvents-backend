// Libs
import { BaseCommand } from '../../../../libs/base-classes/base-command';

class UnblockUserCommand extends BaseCommand {
  readonly userId: number;
  readonly userToUnblockId: number;

  constructor(props: UnblockUserCommand) {
    super();

    this.userToUnblockId = props.userToUnblockId;
    this.userId = props.userId;
  }
}

export { UnblockUserCommand };

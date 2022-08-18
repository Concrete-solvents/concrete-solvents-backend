// Libs
import { BaseCommand } from '../../../../libs/base-classes/base-command';

class BlockUserCommand extends BaseCommand {
  readonly userId: number;
  readonly userToBlockId: number;

  constructor(props: BlockUserCommand) {
    super();

    this.userToBlockId = props.userToBlockId;
    this.userId = props.userId;
  }
}

export { BlockUserCommand };

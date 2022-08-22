// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class ChangeGroupOwnerCommand extends BaseCommand {
  readonly newOwnerId: number;
  readonly userId: number;
  readonly groupId: number;

  constructor(props: ChangeGroupOwnerCommand) {
    super();

    this.newOwnerId = props.newOwnerId;
    this.groupId = props.groupId;
    this.userId = props.userId;
  }
}

export { ChangeGroupOwnerCommand };

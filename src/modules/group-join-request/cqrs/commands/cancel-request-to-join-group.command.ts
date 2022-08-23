// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class CancelRequestToJoinGroupCommand extends BaseCommand {
  readonly userId: number;
  readonly groupId: number;

  constructor(props: CancelRequestToJoinGroupCommand) {
    super();
    this.groupId = props.groupId;
    this.userId = props.userId;
  }
}

export { CancelRequestToJoinGroupCommand };

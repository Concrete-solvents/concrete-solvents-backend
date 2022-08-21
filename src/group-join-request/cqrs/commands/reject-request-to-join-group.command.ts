// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class RejectRequestToJoinGroupCommand extends BaseCommand {
  readonly userId: number;
  readonly joinRequestId: number;

  constructor(props: RejectRequestToJoinGroupCommand) {
    super();
    this.joinRequestId = props.joinRequestId;
    this.userId = props.userId;
  }
}

export { RejectRequestToJoinGroupCommand };

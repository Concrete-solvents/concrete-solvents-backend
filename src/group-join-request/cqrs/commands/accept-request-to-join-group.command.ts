// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class AcceptRequestToJoinGroupCommand extends BaseCommand {
  readonly joinRequestId: number;
  readonly userId: number;

  constructor(props: AcceptRequestToJoinGroupCommand) {
    super();
    this.joinRequestId = props.joinRequestId;
    this.userId = props.userId;
  }
}

export { AcceptRequestToJoinGroupCommand };

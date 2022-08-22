// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class LeaveFromGroupCommand extends BaseCommand {
  readonly userId: number;
  readonly groupId: number;

  constructor(props: LeaveFromGroupCommand) {
    super();
    this.userId = props.userId;
    this.groupId = props.groupId;
  }
}

export { LeaveFromGroupCommand };

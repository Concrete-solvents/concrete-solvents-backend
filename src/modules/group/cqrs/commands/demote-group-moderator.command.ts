// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class DemoteGroupModeratorCommand extends BaseCommand {
  readonly userIdToDemote: number;
  readonly userId: number;
  readonly groupId: number;

  constructor(props: DemoteGroupModeratorCommand) {
    super();
    this.userIdToDemote = props.userIdToDemote;
    this.userId = props.userId;
    this.groupId = props.groupId;
  }
}

export { DemoteGroupModeratorCommand };

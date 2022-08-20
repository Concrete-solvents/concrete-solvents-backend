import { BaseCommand } from '../../../libs/base-classes/base-command';

class AddGroupModeratorCommand extends BaseCommand {
  readonly newModeratorUserId: number;
  readonly groupId: number;
  readonly userId: number;

  constructor(props: AddGroupModeratorCommand) {
    super();
    this.newModeratorUserId = props.newModeratorUserId;
    this.userId = props.userId;
    this.groupId = props.groupId;
  }
}

export { AddGroupModeratorCommand };

// Libs
import { BaseCommand } from '../../../libs/base-classes/base-command';

class DeleteGroupCommand extends BaseCommand {
  readonly groupId: number;
  readonly userId: number;

  constructor(props: DeleteGroupCommand) {
    super();
    this.groupId = props.groupId;
    this.userId = props.userId;
  }
}

export { DeleteGroupCommand };

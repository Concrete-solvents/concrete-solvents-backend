import { BaseCommand } from '../../../libs/base-classes/base-command';

class EditGroupCommand extends BaseCommand {
  readonly groupId: number;
  readonly userId: number;
  readonly name?: string;
  readonly description?: string;
  readonly avatarUrl?: string;

  constructor(props: EditGroupCommand) {
    super();
    this.name = props.name;
    this.description = props.description;
    this.avatarUrl = props.avatarUrl;
    this.groupId = props.groupId;
    this.userId = props.userId;
  }
}

export { EditGroupCommand };

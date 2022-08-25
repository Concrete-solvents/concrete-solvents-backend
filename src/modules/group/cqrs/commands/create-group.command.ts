// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class CreateGroupCommand extends BaseCommand {
  readonly ownerId: number;
  readonly name: string;
  readonly description: string;
  readonly avatarUrl?: string;

  constructor(props: CreateGroupCommand) {
    super();
    this.ownerId = props.ownerId;
    this.name = props.name;
    this.description = props.description || '';
    this.avatarUrl = props.avatarUrl;
  }
}

export { CreateGroupCommand };

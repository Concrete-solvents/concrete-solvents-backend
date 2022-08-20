// Libs
import { BaseCommand } from '../../../libs/base-classes/base-command';

class CreateGroupCommand extends BaseCommand {
  readonly ownerId: number;
  readonly name: string;
  readonly description: string;

  constructor(props: CreateGroupCommand) {
    super();
    this.ownerId = props.ownerId;
    this.name = props.name;
    this.description = props.description || '';
  }
}

export { CreateGroupCommand };

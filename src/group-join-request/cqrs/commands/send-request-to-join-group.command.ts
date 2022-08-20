import { BaseCommand } from '../../../libs/base-classes/base-command';

class SendRequestToJoinGroupCommand extends BaseCommand {
  readonly userId: number;
  readonly groupId: number;

  constructor(props: SendRequestToJoinGroupCommand) {
    super();
    this.groupId = props.groupId;
    this.userId = props.userId;
  }
}

export { SendRequestToJoinGroupCommand };

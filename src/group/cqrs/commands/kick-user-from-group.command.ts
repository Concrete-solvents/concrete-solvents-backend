// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

class KickUserFromGroupCommand extends BaseCommand {
  readonly userToKickId: number;
  readonly userWhoKickId: number;
  readonly groupId: number;

  constructor(props: KickUserFromGroupCommand) {
    super();
    this.userToKickId = props.userToKickId;
    this.userWhoKickId = props.userWhoKickId;
    this.groupId = props.groupId;
  }
}

export { KickUserFromGroupCommand };

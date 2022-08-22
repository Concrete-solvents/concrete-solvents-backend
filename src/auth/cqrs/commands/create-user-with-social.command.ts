// Libs
import { BaseCommand } from '@Libs/base-classes/base-command';

// Auth
import { SocialUser } from '@Auth/interfaces/social-user.interface';

class CreateUserWithSocialCommand extends BaseCommand {
  readonly socialName: string;
  readonly user: SocialUser;

  constructor(props: CreateUserWithSocialCommand) {
    super();
    this.socialName = props.socialName;
    this.user = props.user;
  }
}

export { CreateUserWithSocialCommand };

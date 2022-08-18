// Libs
import { BaseCommand } from '../../../libs/base-classes/base-command';

// Auth
import { SocialUser } from '@Auth/interfaces/social-user.interface';

class LoginUserWithSocialCommand extends BaseCommand {
  readonly socialName: string;
  readonly user: SocialUser;

  constructor(props: LoginUserWithSocialCommand) {
    super();
    this.user = props.user;
    this.socialName = props.socialName;
  }
}

export { LoginUserWithSocialCommand };

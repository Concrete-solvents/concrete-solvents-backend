// Libraries
import { Ok } from 'oxide.ts';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// User
import { SocialEntity } from '@User/entities/social.entity';
import { UserEntity } from '@User/entities/user.entity';

// Auth
import { CreateUserWithSocialCommand } from '@Auth/cqrs/commands/create-user-with-social.command';

// Email
import { EmailEntity } from '@Email/entities/email.entity';

@CommandHandler(CreateUserWithSocialCommand)
class CreateUserWithSocialService implements ICommandHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
    @InjectRepository(SocialEntity)
    private readonly _socialRepository: Repository<SocialEntity>,
  ) {}

  async execute(command: CreateUserWithSocialCommand) {
    let newEmailInDB = null;

    if (command.user.email) {
      const newEmail = await this._emailRepository.create({
        value: command.user.email,
      });

      newEmailInDB = await this._emailRepository.save(newEmail);
    }

    const newSocial = await this._socialRepository.create({
      name: command.socialName,
      socialId: command.user.id,
    });

    const newSocialInDB = await this._socialRepository.save(newSocial);

    const newUser = await this._userRepository.create({
      login: null,
      username: null,
      email: newEmailInDB,
      password: uuidv4(),
      avatarUrl: command.user.avatarUrl,
      linkedSocials: [newSocialInDB],
    });

    const newUserInDB = await this._userRepository.save(newUser);

    return Ok(newUserInDB.id);
  }
}

export { CreateUserWithSocialService };

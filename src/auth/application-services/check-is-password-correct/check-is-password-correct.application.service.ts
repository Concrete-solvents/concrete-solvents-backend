// Libraries
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Auth
import { CheckIsPasswordCorrectCommand } from '@Auth/cqrs/commands/check-is-password-correct.command';

// User
import { UserEntity } from '@User/entities/user.entity';

@CommandHandler(CheckIsPasswordCorrectCommand)
class CheckIsPasswordCorrectApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async execute(command: CheckIsPasswordCorrectCommand): Promise<boolean> {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: command.userId,
      },
    });

    return bcrypt.compare(command.tryPassword, userInDB.password);
  }
}

export { CheckIsPasswordCorrectApplicationService };

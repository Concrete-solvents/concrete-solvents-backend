// Libraries
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Err, Ok } from 'oxide.ts';
import { Repository } from 'typeorm';

// UserRelation
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';
import { BlockUserCommand } from '@UserRelation/cqrs/commands/block-user.command';

@CommandHandler(BlockUserCommand)
class BlockUserApplicationService implements ICommandHandler {
  constructor(
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
  ) {}

  async execute(command: BlockUserCommand) {
    const userRelationInDB = await this._userRelationRepository.findOne({
      where: {
        firstUserId: command.userId,
        secondUserId: command.userToBlockId,
      },
    });

    if (userRelationInDB) {
      if (userRelationInDB.type === UserRelationType.Block) {
        return Err('The user is already blocked');
      }

      await this._userRelationRepository.remove(userRelationInDB);

      const secondRelationInDB = await this._userRelationRepository.findOne({
        where: {
          firstUserId: command.userToBlockId,
          secondUserId: command.userId,
        },
      });

      if (
        secondRelationInDB &&
        secondRelationInDB.type !== UserRelationType.Block
      ) {
        await this._userRelationRepository.remove(secondRelationInDB);
      }
    }

    const newUserRelation = await this._userRelationRepository.create({
      firstUserId: command.userId,
      secondUserId: command.userToBlockId,
      type: UserRelationType.Block,
    });

    await this._userRelationRepository.save(newUserRelation);

    return Ok(true);
  }
}

export { BlockUserApplicationService };

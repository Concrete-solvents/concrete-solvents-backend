// Libraries
import { Err, Ok, Result } from 'oxide.ts';
import { In, Repository } from 'typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Group
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

// User
import { GetUserProfileQuery } from '@User/cqrs/queries/get-user-profile.query';
import { GetUserProfileResponseDto } from '@User/dtos/responses/get-user-profile-response.dto';
import { UserEntity } from '@User/entities/user.entity';

// UserRelation
import { UserRelationTypeormEntity } from '@UserRelation/entities/user-relation.typeorm-entity';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';

@QueryHandler(GetUserProfileQuery)
class GetUserProfileApplicationService implements IQueryHandler {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
    @InjectRepository(GroupTypeormEntity)
    private readonly _groupRepository: Repository<GroupTypeormEntity>,
  ) {}

  async execute(
    query: GetUserProfileQuery,
  ): Promise<Result<GetUserProfileResponseDto, CustomError>> {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: query.userId,
      },
    });

    if (!userInDB) {
      return Err(CustomError.UserDoesNotExist);
    }

    const groupsInDB = await this._groupRepository.find({
      where: {
        users: {
          id: query.userId,
        },
      },
      select: {
        id: true,
        avatarUrl: true,
        description: true,
        name: true,
      },
      take: 3,
    });

    const groupsCount = await this._groupRepository.count({
      where: {
        users: {
          id: query.userId,
        },
      },
    });

    const friendsIds = await this._userRelationRepository.find({
      where: {
        firstUserId: query.userId,
        type: UserRelationType.Friends,
      },
      take: 3,
    });

    const friendsInDB = await this._userRepository.find({
      where: {
        id: In(friendsIds),
      },
      select: {
        username: true,
        id: true,
        avatarUrl: true,
        level: true,
      },
    });

    const friendsCount = await this._userRelationRepository.count({
      where: {
        firstUserId: query.userId,
        type: UserRelationType.Friends,
      },
    });

    let firstRelation;
    let secondRelation;

    if (query.currentUser) {
      const relationInDB = await this._userRelationRepository.findOne({
        where: {
          firstUserId: query.currentUser,
          secondUserId: query.userId,
        },
      });

      if (relationInDB) {
        firstRelation = relationInDB.type;
      }

      const secondRelationInDB = await this._userRelationRepository.findOne({
        where: {
          firstUserId: query.userId,
          secondUserId: query.currentUser,
        },
      });

      if (secondRelationInDB) {
        secondRelation = relationInDB.type;
      }
    }

    return Ok({
      profile: {
        groupsPreview: {
          groups: groupsInDB,
          countOfGroups: groupsCount,
        },
        friendsPreview: {
          friends: friendsInDB,
          countOfFriends: friendsCount,
        },
        userPublicInfo: {
          username: userInDB.username,
          id: userInDB.id,
          level: userInDB.level,
          avatarUrl: userInDB.avatarUrl,
        },
        currentUserRelationWithRequestedUser: firstRelation,
        relationWithCurrentUser: secondRelation,
      },
    });
  }
}

export { GetUserProfileApplicationService };

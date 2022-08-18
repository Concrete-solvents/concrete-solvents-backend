import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@User/entities/user.entity';
import { Ok } from 'oxide.ts';
import { In, Repository } from 'typeorm';
import { GetUserRelationsQuery } from '../../cqrs/queries/get-user-relations/get-user-relations.query';
import { UserRelationTypeormEntity } from '../../entities/user-relation.typeorm-entity';
import { UserRelationType } from '../../enum/user-relation-type.enum';

@QueryHandler(GetUserRelationsQuery)
class GetUserRelationsService implements IQueryHandler {
  constructor(
    @InjectRepository(UserRelationTypeormEntity)
    private readonly _userRelationRepository: Repository<UserRelationTypeormEntity>,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserRelationsQuery): Promise<any> {
    if (query.currentUserId !== query.currentUserId) {
      const friends = await this._getFriends(query.givenUserId);

      return Ok(friends);
    }

    const friends = await this._getFriends(query.givenUserId);
    const sentFriendRequests = await this._getSentFriendRequests(
      query.givenUserId,
    );
    const receivedFriendRequests = await this._getReceivedFriendRequests(
      query.givenUserId,
    );
    const blockedUsers = await this._getBlockedUsers(query.givenUserId);

    return Ok({
      friends,
      receivedFriendRequests,
      sentFriendRequests,
      blockedUsers,
    });
  }

  private async _getFriends(givenUserId: number) {
    const result = await this._userRelationRepository.find({
      where: {
        firstUserId: givenUserId,
        type: UserRelationType.Friends,
      },
      select: {
        secondUserId: true,
      },
    });

    const friendIds = result.map((el) => el.secondUserId);

    return this._getUsersByIds(friendIds);
  }

  private async _getSentFriendRequests(givenUserId: number) {
    const sentFriendsRequestsResult = await this._userRelationRepository.find({
      where: {
        firstUserId: givenUserId,
        type: UserRelationType.FiendsPending,
      },
    });

    const sentFriendRequestIds = sentFriendsRequestsResult.map(
      (el) => el.secondUserId,
    );

    return this._getUsersByIds(sentFriendRequestIds);
  }

  private async _getReceivedFriendRequests(givenUserId: number) {
    const receivedFriendsRequestsResult =
      await this._userRelationRepository.find({
        where: {
          secondUserId: givenUserId,
          type: UserRelationType.FiendsPending,
        },
      });

    const receivedFriendRequestIds = receivedFriendsRequestsResult.map(
      (el) => el.firstUserId,
    );

    return this._getUsersByIds(receivedFriendRequestIds);
  }

  private async _getBlockedUsers(givenUserId: number) {
    const blockedUsersResult = await this._userRelationRepository.find({
      where: {
        firstUserId: givenUserId,
        type: UserRelationType.Block,
      },
    });

    const blockedUserIds = blockedUsersResult.map((el) => el.firstUserId);

    return this._getUsersByIds(blockedUserIds);
  }

  private _getUsersByIds(userIds: number[]) {
    return this._userRepository.find({
      where: {
        id: In(userIds),
      },
      select: {
        id: true,
        username: true,
        level: true,
        avatarUrl: true,
      },
    });
  }
}

export { GetUserRelationsService };

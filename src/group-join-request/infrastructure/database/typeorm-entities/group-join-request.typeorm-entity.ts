import { CoreEntity } from '@Common/entities/core.entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';
import { UserEntity } from '@User/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
class GroupJoinRequestTypeormEntity extends CoreEntity {
  @ManyToOne(() => GroupTypeormEntity, (group) => group.joinRequests)
  group: GroupTypeormEntity;

  @ManyToOne(() => UserEntity, () => null)
  sentBy: UserEntity;
}

export { GroupJoinRequestTypeormEntity };

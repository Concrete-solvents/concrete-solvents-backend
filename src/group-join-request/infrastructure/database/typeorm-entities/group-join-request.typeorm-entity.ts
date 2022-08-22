// Libraries
import { Entity, ManyToOne } from 'typeorm';

// Common
import { CoreEntity } from '@Common/entities/core.entity';

// Group
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

// User
import { UserEntity } from '@User/entities/user.entity';

@Entity()
class GroupJoinRequestTypeormEntity extends CoreEntity {
  @ManyToOne(() => GroupTypeormEntity, (group) => group.joinRequests)
  group: GroupTypeormEntity;

  @ManyToOne(() => UserEntity, () => null)
  sentBy: UserEntity;
}

export { GroupJoinRequestTypeormEntity };

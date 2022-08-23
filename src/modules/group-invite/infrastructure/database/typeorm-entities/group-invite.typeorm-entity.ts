// Libraries
import { Entity, ManyToOne } from 'typeorm';

// Common
import { CoreEntity } from '@Common/entities/core.entity';

// group
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';

// User
import { UserEntity } from '@User/entities/user.entity';

@Entity()
class GroupInviteTypeormEntity extends CoreEntity {
  @ManyToOne(() => UserEntity, () => null)
  sentTo: UserEntity;

  @ManyToOne(() => GroupTypeormEntity, (group) => group.invites)
  group: GroupTypeormEntity;

  @ManyToOne(() => UserEntity, () => null)
  sentBy: UserEntity;
}

export { GroupInviteTypeormEntity };

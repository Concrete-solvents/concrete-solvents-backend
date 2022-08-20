import { CoreEntity } from '@Common/entities/core.entity';
import { GroupTypeormEntity } from '@Group/infrastructure/database/typeorm-entities/group.typeorm-entity';
import { UserEntity } from '@User/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

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

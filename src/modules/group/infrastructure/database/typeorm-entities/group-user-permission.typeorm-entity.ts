// Libraries
import { Column, Entity, ManyToOne } from 'typeorm';

// Common
import { CoreEntity } from '@Common/entities/core.entity';

// Group
import { GroupUserPermission } from '@Group/enums/group-user-permission';
import { GroupTypeormEntity } from './group.typeorm-entity';

@Entity()
class GroupUserPermissionTypeormEntity extends CoreEntity {
  @Column({ enum: GroupUserPermission })
  permission: GroupUserPermission;

  @Column()
  userId: number;

  @ManyToOne(() => GroupTypeormEntity, (group) => group.groupUserPermissions, {
    onDelete: 'CASCADE',
  })
  group: GroupTypeormEntity;
}

export { GroupUserPermissionTypeormEntity };

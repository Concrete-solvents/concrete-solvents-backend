// Libraries
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

// Common
import { CoreEntity } from '@Common/entities/core.entity';

// GroupInvite
import { GroupInviteTypeormEntity } from '@GroupInvite/infrastructure/database/typeorm-entities/group-invite.typeorm-entity';

// groupJoinRequest
import { GroupJoinRequestTypeormEntity } from '@GroupJoinRequest/infrastructure/database/typeorm-entities/group-join-request.typeorm-entity';

// User
import { UserEntity } from '@User/entities/user.entity';

// Group
import { GroupUserPermissionTypeormEntity } from './group-user-permission.typeorm-entity';

@Entity()
class GroupTypeormEntity extends CoreEntity {
  @Column()
  name: string;

  @Column({
    default:
      'https://www.nicepng.com/png/detail/131-1318812_avatar-group-icon.png',
  })
  avatarUrl: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.groups)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(
    () => GroupUserPermissionTypeormEntity,
    (permission) => permission.group,
    { onDelete: 'CASCADE' },
  )
  groupUserPermissions: GroupUserPermissionTypeormEntity[];

  @OneToMany(() => GroupJoinRequestTypeormEntity, (request) => request.group, {
    onDelete: 'CASCADE',
  })
  joinRequests: GroupJoinRequestTypeormEntity[];

  @OneToMany(() => GroupInviteTypeormEntity, (invite) => invite.group)
  invites: GroupInviteTypeormEntity[];
}

export { GroupTypeormEntity };

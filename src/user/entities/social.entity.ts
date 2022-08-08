// Libraries
import { Column, Entity, ManyToOne } from 'typeorm';

// Common
import { CoreEntity } from '@Common/entities/core.entity';

// User
import { UserEntity } from '@User/entities/user.entity';

@Entity()
class SocialEntity extends CoreEntity {
  @Column()
  name: string;

  @Column()
  socialId: string;

  @ManyToOne(() => UserEntity, (user) => user.linkedSocials)
  user: UserEntity;
}

export { SocialEntity };

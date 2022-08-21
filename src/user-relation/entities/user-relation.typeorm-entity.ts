// Libraries
import { Entity, Column } from 'typeorm';

// Common
import { CoreEntity } from '@Common/entities/core.entity';

// UserRelation
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';

@Entity()
class UserRelationTypeormEntity extends CoreEntity {
  @Column()
  firstUserId: number;

  @Column()
  secondUserId: number;

  @Column({ enum: UserRelationType })
  type: UserRelationType;
}

export { UserRelationTypeormEntity };

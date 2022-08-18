import { CoreEntity } from '@Common/entities/core.entity';
import { Entity, Column } from 'typeorm';
import { UserRelationType } from '../enum/user-relation-type.enum';

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

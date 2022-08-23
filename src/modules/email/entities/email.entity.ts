// Libraries
import { CoreEntity } from '@Common/entities/core.entity';
import { Column, Entity, OneToOne } from 'typeorm';

// User
import { UserEntity } from '@User/entities/user.entity';

@Entity()
class EmailEntity extends CoreEntity {
  @Column()
  value: string;

  @Column({ default: false })
  isConfirm: boolean;

  @Column({ nullable: true })
  verificationCode?: string;

  @Column({ nullable: true })
  restoreCode?: string;

  @OneToOne(() => UserEntity, (user) => user.email)
  user: UserEntity;
}

export { EmailEntity };

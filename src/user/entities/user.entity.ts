// Libraries
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Common
import { CoreEntity } from '@Common/entities/core.entity';
import { EmailEntity } from '@Email/entities/email.entity';

@Entity('users')
class UserEntity extends CoreEntity {
  @Column({ unique: true })
  username: string;

  @OneToOne(() => EmailEntity, (email) => email.user, { nullable: true })
  @JoinColumn()
  email?: EmailEntity;

  @Column()
  password: string;

  @Column({ default: '' })
  avatarUrl: string;

  @Column({ nullable: true })
  socialId: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

export { UserEntity };

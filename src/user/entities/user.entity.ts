// Libraries
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

// Common
import { CoreEntity } from '@Common/entities/core.entity';

// Email
import { EmailEntity } from '@Email/entities/email.entity';

// User
import { SocialEntity } from '@User/entities/social.entity';

// Settings
import { SettingsEntity } from '@Settings/entity/Settings.entity';

@Entity('users')
class UserEntity extends CoreEntity {
  @Column({ unique: true, nullable: true })
  login: string;

  @Column({ nullable: true })
  username: string;

  @OneToOne(() => EmailEntity, (email) => email.user, { nullable: true })
  @JoinColumn()
  email?: EmailEntity;

  @Column()
  password: string;

  @Column({ default: '' })
  avatarUrl: string;

  @OneToMany(() => SocialEntity, (social) => social.user)
  linkedSocials: SocialEntity[];

  @OneToOne(() => SettingsEntity)
  @JoinColumn()
  settings: SettingsEntity;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

export { UserEntity };

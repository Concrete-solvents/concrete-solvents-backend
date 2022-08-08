// Libraries
import { Column, Entity } from 'typeorm';

// Common
import { CoreEntity } from '@Common/entities/core.entity';

@Entity()
class SettingsEntity extends CoreEntity {
  @Column()
  language: string;
}

export { SettingsEntity };

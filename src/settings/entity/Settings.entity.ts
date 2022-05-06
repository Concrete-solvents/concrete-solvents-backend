import { CoreEntity } from '@Common/entities/core.entity';
import { Entity } from 'typeorm';

@Entity()
class SettingsEntity extends CoreEntity {}

export { SettingsEntity };

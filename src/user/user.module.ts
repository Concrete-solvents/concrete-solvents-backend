// Libraries
import { EmailModule } from '@Email/email.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Email
import { EmailEntity } from '@Email/entities/email.entity';
import { SettingsEntity } from '@Settings/entity/Settings.entity';
import { GetUsersPublicInfoByIdsService } from '@User/domain/services/get-users-public-info-by-ids.service';

// User
import { UserEntity } from '@User/entities/user.entity';
import { UserController } from '@User/user.controller';
import { UserService } from '@User/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, EmailEntity, SettingsEntity]),
    EmailModule,
    CqrsModule,
  ],
  providers: [UserService, GetUsersPublicInfoByIdsService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

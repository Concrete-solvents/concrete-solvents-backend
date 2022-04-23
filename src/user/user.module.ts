// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// User
import { UserEntity } from '@User/entities/user.entity';
import { UserController } from '@User/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
})
export class UserModule {}

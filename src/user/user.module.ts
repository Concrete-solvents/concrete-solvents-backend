// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// User
import { UserEntity } from '@User/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}

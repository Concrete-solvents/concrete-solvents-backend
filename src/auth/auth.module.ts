// Libraries
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

// Auth
import { JwtStrategy } from '@Auth/strategies/jwt.strategy';
import { AuthController } from '@Auth/auth.controller';
import { AuthService } from '@Auth/auth.service';

// User
import { UserModule } from '@User/user.module';
import { UserEntity } from '@User/entities/user.entity';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [UserModule, PassportModule, TypeOrmModule.forFeature([UserEntity])],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

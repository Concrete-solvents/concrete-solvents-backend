// Libraries
import { EmailEntity } from '@Email/entities/email.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

// Auth
import { GithubAuthController } from '@Auth/github-auth.controller';
import { GithubAuthService } from '@Auth/github-auth.service';
import { GoogleAuthController } from '@Auth/google-auth.controller';
import { GoogleAuthService } from '@Auth/google-auth.service';
import { GithubStrategy } from '@Auth/strategies/github.strategy';
import { JwtStrategy } from '@Auth/strategies/jwt.strategy';
import { AuthController } from '@Auth/auth.controller';
import { AuthService } from '@Auth/auth.service';
import { GoogleStrategy } from '@Auth/strategies/google.strategy';

// User
import { UserModule } from '@User/user.module';
import { UserEntity } from '@User/entities/user.entity';

@Module({
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    GithubAuthService,
    GoogleAuthService,
  ],
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([UserEntity, EmailEntity]),
  ],
  exports: [AuthService],
  controllers: [AuthController, GithubAuthController, GoogleAuthController],
})
export class AuthModule {}

import { AuthModule } from '@Auth/auth.module';
import { EmailModule } from '@Email/email.module';
import { NodeMailerModule } from '@Mailer/node-mailer.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@User/user.module';
import { getNodeMailerConfig } from '../configs/nodeMailer.config';
import joiSchema from '../joi.schema';
import { getTypeormConfig } from '../configs/typeorm.config';
import { JwtLocalModule } from './jwt-local/jwt-local.module';
import { SocialModule } from './social/social.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.dev.env',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: joiSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeormConfig,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getNodeMailerConfig,
    }),
    JwtLocalModule,
    UserModule,
    AuthModule,
    EmailModule,
    NodeMailerModule,
    SocialModule,
  ],
})
export class AppModule {}

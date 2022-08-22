import { AuthModule } from '@Auth/auth.module';
import { EmailModule } from '@Email/email.module';
import { GroupInviteModule } from '@GroupInvite/group-invite.module';
import { GroupJoinRequestModule } from '@GroupJoinRequest/group-join-request.module';
import { NodeMailerModule } from '@Mailer/node-mailer.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@User/user.module';
import { getNodeMailerConfig } from '../configs/nodeMailer.config';
import joiSchema from '../joi.schema';
import { getTypeormConfig } from '../configs/typeorm.config';
import { GroupModule } from '@Group/group.module';
import { JwtLocalModule } from './jwt-local/jwt-local.module';
import { SocialModule } from './social/social.module';
import { UserRelationModule } from '@UserRelation/user-relation.module';
import { FileUploadModule } from "@FileUploader/file-uploader.module";
import {MulterModule} from "@nestjs/platform-express";

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
    MulterModule.register({
      dest: './uploads'
    }),
    JwtLocalModule,
    UserModule,
    AuthModule,
    EmailModule,
    NodeMailerModule,
    SocialModule,
    UserRelationModule,
    GroupModule,
    FileUploadModule,
    GroupInviteModule,
    GroupJoinRequestModule,
  ],
})
export class AppModule {}

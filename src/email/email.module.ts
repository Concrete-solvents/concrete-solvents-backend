// Libraries
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// User
import { UserEntity } from '@User/entities/user.entity';

// Email
import { EmailEntity } from '@Email/entities/email.entity';
import { CreateEmailApplicationService } from '@Email/application-services/create-email/create-email.application-service';
import { SendAccountRestoreCodeApplicationService } from '@Email/application-services/send-account-restore-code/send-account-restore-code.application-service';
import { SendVerificationCodeApplicationService } from '@Email/application-services/send-verification-code/send-verification-code.application-service';
import { UpdateEmailApplicationService } from '@Email/application-services/update-email/update-email.application-service';
import { VerifyEmailApplicationService } from '@Email/application-services/verify-email/verify-email.application-service';
import { SendAccountRestoreCodeHttpController } from '@Email/controllers/send-account-restore-code/send-account-restore-code-http-controller/send-account-restore-code.http-controller';
import { SendVerificationCodeHttpController } from '@Email/controllers/send-verification-code/send-verification-code-http-controller/send-verification-code.http-controller';
import { VerifyEmailHttpController } from '@Email/controllers/verify-email/verify-email-http-controller/verify-email.http-controller';

const httpControllers = [
  VerifyEmailHttpController,
  SendVerificationCodeHttpController,
  SendAccountRestoreCodeHttpController,
];

const applicationServices = [
  CreateEmailApplicationService,
  SendAccountRestoreCodeApplicationService,
  SendVerificationCodeApplicationService,
  UpdateEmailApplicationService,
  VerifyEmailApplicationService,
];

@Module({
  controllers: [...httpControllers],
  providers: [...applicationServices],
  imports: [TypeOrmModule.forFeature([UserEntity, EmailEntity]), CqrsModule],
})
class EmailModule {}

export { EmailModule };

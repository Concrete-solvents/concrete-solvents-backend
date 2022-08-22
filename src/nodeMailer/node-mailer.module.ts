// Libraries
import { Module } from '@nestjs/common';

// Mailer
import { SendAccountRestoreCodeToEmailApplicationService } from '@Mailer/application-services/send-account-restore-code-to-email/send-account-restore-code-to-email.application-service';
import { SendVerificationCodeToEmailApplicationService } from '@Mailer/application-services/send-verification-code-to-email/send-verification-code-to-email.application-service';

const applicationServices = [
  SendAccountRestoreCodeToEmailApplicationService,
  SendVerificationCodeToEmailApplicationService,
];

@Module({
  providers: [...applicationServices],
})
class NodeMailerModule {}

export { NodeMailerModule };

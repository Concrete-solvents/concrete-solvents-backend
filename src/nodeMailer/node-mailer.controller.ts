// Libraries
import { Module } from '@nestjs/common';

// Mailer
import { NodeMailerService } from '@Mailer/node-mailer.service';

@Module({
  providers: [NodeMailerService],
  exports: [NodeMailerService],
})
class NodeMailerModule {}

export { NodeMailerModule };

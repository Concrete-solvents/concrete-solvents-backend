// Libraries
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// Mailer
import { NodeMailerModule } from '@Mailer/node-mailer.controller';

// User
import { UserEntity } from '@User/entities/user.entity';

// Email
import { EmailController } from '@Email/email.controller';
import { EmailService } from '@Email/email.service';
import { EmailEntity } from '@Email/entities/email.entity';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    NodeMailerModule,
    TypeOrmModule.forFeature([UserEntity, EmailEntity]),
  ],
  exports: [EmailService],
})
class EmailModule {}

export { EmailModule };

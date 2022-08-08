// Libraries
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Email
import { EmailEntity } from '@Email/entities/email.entity';
import { SendRestoreCodeRequestDto } from '@Email/dtos/SendRestoreCodeRequest.dto';

// Common
import { CustomError } from '@Common/enums/custom-errors';
import { CoreResponse } from '@Common/dtos/core-response.dto';

// Mailer
import { NodeMailerService } from '@Mailer/node-mailer.service';

// User
import { UserEntity } from '@User/entities/user.entity';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Injectable()
class EmailService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
    private readonly _nodeMailerService: NodeMailerService,
  ) {}

  async sendVerificationCode(user: UserBaseResponse): Promise<CoreResponse> {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        email: true,
      },
    });

    if (!userInDB) {
      return {
        isSuccess: false,
        error: CustomError.UserDoesNotExist,
      };
    }

    if (!userInDB.email) {
      return {
        isSuccess: false,
        error: CustomError.EmailDoesNotLinked,
      };
    }

    if (userInDB.email.isConfirm) {
      return {
        isSuccess: false,
        error: CustomError.EmailAlreadyConfirmed,
      };
    }

    const code = EmailService.generateCode();

    await this.updateVerificationCode(userInDB.email.id, code);

    await this._nodeMailerService.sendVerificationCode(
      userInDB.email.value,
      code,
    );

    return {
      isSuccess: true,
    };
  }

  async sendRestoreCode(
    sendRestoreCodeDto: SendRestoreCodeRequestDto,
  ): Promise<CoreResponse> {
    const emailInDB = await this._emailRepository.findOneBy({
      value: sendRestoreCodeDto.email,
      isConfirm: true,
    });

    if (!emailInDB) {
      return {
        isSuccess: false,
        error: CustomError.EmailNotFoundOrNotConfirmed,
      };
    }

    const code = EmailService.generateCode();

    await this.updateRestoreCode(emailInDB.id, code);

    await this._nodeMailerService.sendRestoreCode(emailInDB.value, code);

    return {
      isSuccess: true,
    };
  }

  async verifyEmail(email: string, code: string): Promise<string> {
    const emailInDB = await this._emailRepository.findOne({
      where: {
        value: email,
        verificationCode: code,
      },
    });

    if (!emailInDB) {
      return 'Произошла ошибка';
    }

    emailInDB.isConfirm = true;

    await this._emailRepository.save(emailInDB);

    return 'Спасибо за подтверждение';
  }

  private async updateVerificationCode(
    emailId: number,
    code: string,
  ): Promise<void> {
    const emailInDB = await this._emailRepository.findOneBy({
      id: emailId,
    });

    emailInDB.verificationCode = code;

    await this._emailRepository.save(emailInDB);
  }

  private async updateRestoreCode(
    emailId: number,
    code: string,
  ): Promise<void> {
    const emailInDB = await this._emailRepository.findOneBy({
      id: emailId,
    });

    emailInDB.restoreCode = code;

    await this._emailRepository.save(emailInDB);
  }

  private static generateCode(): string {
    return uuidv4().split('-')[0];
  }

  public async checkIsEmailAlreadyBusy(email: string): Promise<boolean> {
    const emailInDB = await this._emailRepository.findOne({
      where: {
        value: email,
        isConfirm: true,
      },
    });

    return Boolean(emailInDB);
  }

  public async updateEmailValueAndSendVerificationCode(
    emailId: number,
    newEmailValue: string,
  ) {
    const emailInDB = await this._emailRepository.findOne({
      where: {
        id: emailId,
      },
    });

    emailInDB.value = newEmailValue;
    emailInDB.isConfirm = false;
    emailInDB.verificationCode = EmailService.generateCode();
    emailInDB.restoreCode = null;

    const updatedEmail = await this._emailRepository.save(emailInDB);

    await this._nodeMailerService.sendVerificationCode(
      updatedEmail.value,
      updatedEmail.verificationCode,
    );
  }

  public async createEmailAndSendVerificationCode(
    emailValue: string,
  ): Promise<EmailEntity> {
    const email = await this._emailRepository.create({
      value: emailValue,
      verificationCode: EmailService.generateCode(),
    });

    const emailInDB = await this._emailRepository.save(email);

    await this._nodeMailerService.sendVerificationCode(
      emailInDB.value,
      emailInDB.verificationCode,
    );

    return emailInDB;
  }
}

export { EmailService };

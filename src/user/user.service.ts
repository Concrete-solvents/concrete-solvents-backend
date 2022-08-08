// Libraries
import { CustomError } from '@Common/enums/custom-errors';
import { EmailService } from '@Email/email.service';
import { EmailEntity } from '@Email/entities/email.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@User/entities/user.entity';

// User
import { UpdateUserRequestDto } from '@User/interfaces/update-user-request.dto';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { Repository } from 'typeorm';

@Injectable()
class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
    private readonly _emailService: EmailService,
  ) {}

  async updateUser(
    user: UserBaseResponse,
    updateUserDto: UpdateUserRequestDto,
  ) {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        email: true,
      },
    });

    /*
      Check email and login are not busy and the old password is correct
    */

    if (updateUserDto.email) {
      const isEmailIsAlreadyBusy =
        await this._emailService.checkIsEmailAlreadyBusy(updateUserDto.email);

      if (isEmailIsAlreadyBusy) {
        return {
          isSuccess: false,
          error: CustomError.EmailIsAlreadyBusy,
        };
      }
    }

    if (updateUserDto.login) {
      const isLoginIsAlreadyBusy = await this._userRepository.findOne({
        where: {
          login: updateUserDto.login,
        },
      });

      if (isLoginIsAlreadyBusy) {
        return {
          isSuccess: false,
          error: CustomError.LoginIsAlreadyBusy,
        };
      }
    }

    if (updateUserDto.newPassword) {
      const isPasswordCorrect = this.checkPassword(
        updateUserDto.oldPassword,
        user.id,
      );

      if (!isPasswordCorrect) {
        return {
          isSuccess: false,
          error: CustomError.WrongPassword,
        };
      }
    }

    /*
      Update user entity
    */

    if (updateUserDto.email) {
      if (userInDB.email) {
        await this._emailService.updateEmailValueAndSendVerificationCode(
          userInDB.email.id,
          updateUserDto.email,
        );
      } else {
        const newEmail = await this._emailService.createEmailAndSendVerificationCode(
          updateUserDto.email,
        )

        userInDB.email = newEmail;
      }
    }

    if (updateUserDto.login) {
      if (!userInDB.login) {
        userInDB.username = updateUserDto.login;
      }
      userInDB.login = updateUserDto.login;
    }

    if (updateUserDto.username) {
      userInDB.username = updateUserDto.username;
    }

    if (updateUserDto.avatarUrl) {
      userInDB.avatarUrl = updateUserDto.avatarUrl;
    }

    if (updateUserDto.newPassword) {
      userInDB.password = await bcrypt.hash(updateUserDto.newPassword, 10);
    }

    await this._userRepository.save(userInDB);

    const updatedUser = await this._userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        email: true,
      },
    });

    return {
      isSuccess: true,
      user: {
        login: updatedUser.login,
        username: updatedUser.username,
        avatarUrl: updatedUser.avatarUrl,
        email: updatedUser.email.value,
        isVerified: updatedUser.email.isConfirm,
      },
    };
  }

  async checkPassword(password: string, userId: number): Promise<boolean> {
    const userInDB = await this._userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return bcrypt.compare(password, userInDB.password);
  }

  async getMe(userId: number): Promise<UserBaseResponse> {
    const user = await this._userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        email: true,
      },
    });

    return {
      login: user.login,
      username: user.username,
      email: user.email.value,
      isVerified: user.email.isConfirm,
      avatarUrl: user.avatarUrl,
      id: user.id,
    };
  }
}

export { UserService };

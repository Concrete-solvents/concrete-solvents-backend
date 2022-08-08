// Libraries
import { SocialUser } from '@Auth/interfaces/social-user.interface';
import { SettingsEntity } from '@Settings/entity/Settings.entity';
import { SocialEntity } from '@User/entities/social.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

// Auth
import { RegistrationRequest } from '@Auth/dtos/registration-request.dto';
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';
import { LoginRequest } from '@Auth/dtos/login-request.dto';
import { LoginResponse } from '@Auth/dtos/login-response.dto';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { EmailEntity } from '@Email/entities/email.entity';
import { EmailService } from '@Email/email.service';

// User
import { UserEntity } from '@User/entities/user.entity';
import { UserService } from '@User/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _userService: UserService,
    private readonly _emailService: EmailService,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
    @InjectRepository(SettingsEntity)
    private readonly _settingsRepository: Repository<SettingsEntity>,
    @InjectRepository(SocialEntity)
    private readonly _socialRepository: Repository<SocialEntity>,
  ) {
  }

  async login(loginDto: LoginRequest): Promise<LoginResponse> {
    if (loginDto.login) {
      loginDto.login = loginDto.login.toLowerCase();
    } else {
      loginDto.email = loginDto.email.toLowerCase();
    }

    let userInDB = null;

    if (loginDto.login) {
      userInDB = await this._userRepository.findOne({
        where: {
          login: loginDto.login,
        },
        relations: {
          email: true,
        },
      });
    } else {
      const emailInDB = await this._emailRepository.findOne({
        where: {
          value: loginDto.email,
        },
        relations: {
          user: true,
        },
      });

      userInDB = {
        ...emailInDB.user, email: {
          value: emailInDB.value,
          id: emailInDB.value,
          isConfirm: emailInDB.isConfirm,
        },
      };
    }

    if (!userInDB) {
      return {
        isSuccess: false,
        error: CustomError.WrongLoginOrPassword,
      };
    }

    const isPasswordCorrect = await this._userService.checkPassword(
      loginDto.password,
      userInDB.id,
    );

    if (!isPasswordCorrect) {
      return {
        isSuccess: false,
        error: CustomError.WrongLoginOrPassword,
      };
    }

    return {
      isSuccess: true,
      user: {
        login: userInDB.login,
        username: userInDB.username,
        id: userInDB.id,
        email: userInDB.email.value,
        avatarUrl: userInDB.avatarUrl,
        isVerified: userInDB.email.isConfirm,
      },
    };
  }

  async registration(
    registrationDto: RegistrationRequest,
  ): Promise<RegistrationResponse> {
    registrationDto.login = registrationDto.login.toLowerCase();

    const isUserAlreadyExist = await this._userRepository.findOne({
      where: {
        login: registrationDto.login,
      },
    });

    if (isUserAlreadyExist) {
      return {
        isSuccess: false,
        error: CustomError.LoginIsAlreadyBusy,
      };
    }

    const isLoginCompatibleWithPattern = /^[A-z\d]+$/.test(
      registrationDto.login,
    );

    if (!isLoginCompatibleWithPattern) {
      return {
        isSuccess: false,
        error: CustomError.LoginIncompatibleWithPattern,
      };
    }

    const isEmailAlreadyBusy = await this._emailService.checkIsEmailAlreadyBusy(
      registrationDto.email,
    );

    if (isEmailAlreadyBusy) {
      return {
        isSuccess: false,
        error: CustomError.EmailIsAlreadyBusy,
      };
    }

    const email = await this._emailService.createEmailAndSendVerificationCode(
      registrationDto.email,
    );

    const newSettings = await this._settingsRepository.create({
      language: registrationDto.language,
    });

    const newSettingsInDB = await this._settingsRepository.save(newSettings);

    const newUserInstance = await this._userRepository.create({
      login: registrationDto.login,
      username: registrationDto.login,
      password: registrationDto.password,
      email: email,
      settings: newSettingsInDB,
    });

    await this._userRepository.save(newUserInstance);

    const userInDB = await this._userRepository.findOne({
      where: {
        login: registrationDto.login,
      },
      relations: {
        email: true,
      },
    });

    return {
      user: {
        login: userInDB.login,
        username: userInDB.username,
        id: userInDB.id,
        email: email.value,
        isVerified: email.isConfirm,
        avatarUrl: userInDB.avatarUrl,
      },
      isSuccess: true,
    };
  }

  public async createUserWithSocial(socialName: string, user: SocialUser) {
    let newEmailInDB = null;

    if (user.email) {
      const newEmail = await this._emailRepository.create({
        value: user.email,
      });

      newEmailInDB = await this._emailRepository.save(newEmail);
    }

    const newSocial = await this._socialRepository.create({
      name: socialName,
      socialId: user.id,
    });

    const newSocialInDB = await this._socialRepository.save(newSocial);

    const newUser = await this._userRepository.create({
      login: null,
      username: null,
      email: newEmailInDB,
      password: uuidv4(),
      avatarUrl: user.avatarUrl,
      linkedSocials: [newSocialInDB],
    });

    const newUserInDB = await this._userRepository.save(newUser);

    return newUserInDB.id;
  }

  async socialLogin(socialName: string, user: SocialUser) {
    const socialInDB = await this._socialRepository.findOne({
      where: {
        name: socialName,
        socialId: user.id,
      },
      relations: {
        user: true,
      },
    });

    let userId = socialInDB?.user?.id || null;

    if (!socialInDB) {
      userId = await this.createUserWithSocial(socialName, user);
    }

    const resultUserInDB = await this._userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        email: true,
      },
    });

    return {
      isSuccess: true,
      user: {
        login: resultUserInDB.login,
        username: resultUserInDB.username,
        id: resultUserInDB.id,
        email: resultUserInDB.email?.value,
        avatarUrl: resultUserInDB.avatarUrl,
        isVerified: resultUserInDB.email?.isConfirm || false,
      },
    };
  }
}

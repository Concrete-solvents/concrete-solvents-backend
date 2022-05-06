// Libraries
import { EmailEntity } from '@Email/entities/email.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

// User
import { UserEntity } from '@User/entities/user.entity';

// Auth
import { RegistrationRequest } from '@Auth/dtos/registration-request.dto';
import { LoginRequest } from '@Auth/dtos/login-request.dto';
import { LoginResponse } from '@Auth/dtos/login-response.dto';
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';

// Common
import { CustomError } from '@Common/enums/custom-errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
  ) {}

  async login(loginDto: LoginRequest): Promise<LoginResponse> {
    const userInDB = await this._userRepository.findOne({
      where: {
        username: loginDto.username,
      },
      relations: ['email'],
    });

    if (!userInDB) {
      return {
        isSuccess: false,
        error: CustomError.WrongUsernameOrPassword,
        user: null,
      };
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      userInDB.password,
    );

    if (!isPasswordCorrect) {
      return {
        isSuccess: false,
        error: CustomError.WrongUsernameOrPassword,
        user: null,
      };
    }

    return {
      isSuccess: true,
      user: {
        username: userInDB.username,
        id: userInDB.id,
        email: userInDB.email.value,
        avatarUrl: userInDB.avatarUrl,
      },
    };
  }

  async register(
    registrationDto: RegistrationRequest,
  ): Promise<RegistrationResponse> {
    const isUserAlreadyExist = await this._userRepository.findOne({
      where: {
        username: registrationDto.username,
      },
    });

    if (isUserAlreadyExist) {
      return {
        isSuccess: false,
        error: CustomError.UserWithGivenUsernameAlreadyExist,
        user: null,
      };
    }

    const isUsernameCompatibleWithPattern = /^[A-z0-9]+$/.test(
      registrationDto.username,
    );

    if (!isUsernameCompatibleWithPattern) {
      return {
        isSuccess: false,
        error: CustomError.UsernameIncompatibleWithPattern,
        user: null,
      };
    }

    registrationDto.username = registrationDto.username.toLowerCase();

    const email = await this._emailRepository.create({
      value: registrationDto.email,
    });

    await this._emailRepository.save(email);

    const newUserInstance = await this._userRepository.create({
      username: registrationDto.username,
      avatarUrl: registrationDto.username || '',
      password: registrationDto.password,
      email: email,
    });

    const userInDB = await this._userRepository.save(newUserInstance);

    return {
      user: {
        username: userInDB.username,
        id: userInDB.id,
        email: email.value,
        avatarUrl: userInDB.avatarUrl,
      },
      isSuccess: true,
    };
  }
}

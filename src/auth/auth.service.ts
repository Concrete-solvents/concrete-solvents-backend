// Libraries
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
import { LoginResponseWithAccessToken } from '@Auth/dtos/login-response-with-access-token.dto';
import { RegistrationResponseWithAccessToken } from '@Auth/dtos/registration-response-with-access-token.dto';

// Common
import { CustomError } from '@Common/enums/custom-errors';
import { CoreResponse } from '@Common/dtos/core-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async login(
    loginDto: LoginRequest,
  ): Promise<CoreResponse | LoginResponseWithAccessToken> {
    const userInDB = await this._userRepository.findOne({
      where: {
        username: loginDto.username,
      },
    });

    if (!userInDB) {
      return {
        isSuccess: false,
        error: CustomError.WrongLoginOrPassword,
      };
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      userInDB.password,
    );

    if (!isPasswordCorrect) {
      return {
        isSuccess: false,
        error: CustomError.WrongLoginOrPassword,
      };
    }

    const payload = {
      username: userInDB.username,
      id: userInDB.id,
      email: userInDB.email,
    };

    return {
      isSuccess: true,
      user: payload,
      accessToken: this._jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async register(
    registrationDto: RegistrationRequest,
  ): Promise<CoreResponse | RegistrationResponseWithAccessToken> {
    const isUserAlreadyExist = await this._userRepository.findOne({
      where: {
        username: registrationDto.username,
      },
    });

    if (isUserAlreadyExist) {
      return {
        isSuccess: false,
        error: CustomError.AlreadyExist,
      };
    }

    const isUsernameCompatibleWithPattern = /^[A-z0-9]+$/.test(
      registrationDto.username,
    );

    if (!isUsernameCompatibleWithPattern) {
      return {
        isSuccess: false,
        error: CustomError.UsernameIncompatibleWithPattern,
      };
    }

    registrationDto.username = registrationDto.username.toLowerCase();

    const newUserInstance = await this._userRepository.create(registrationDto);

    const userInDB = await this._userRepository.save(newUserInstance);

    const payload = {
      username: userInDB.username,
      id: userInDB.id,
      email: userInDB.email,
    };

    return {
      user: payload,
      accessToken: this._jwtService.sign(payload, { expiresIn: '30d' }),
      isSuccess: true,
    };
  }
}

// Libraries
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

// User
import { UserEntity } from '@User/entities/user.entity';

// Auth
import { RegistrationDto } from '@Auth/dtos/registration.dto';
import { LoginDto } from '@Auth/dtos/login.dto';
import { AccessTokenDto } from '@Auth/dtos/access-token.dto';

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

  async login(loginDto: LoginDto): Promise<CoreResponse | AccessTokenDto> {
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

    const payload = { username: userInDB.username, id: userInDB.id };

    return {
      access_token: this._jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async register(registrationDto: RegistrationDto) {
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

    const isUsernameCompatibleWithPattern = /^[A-z0-9_-]+$/.test(
      registrationDto.username,
    );

    if (!isUsernameCompatibleWithPattern) {
      return {
        isSuccess: false,
        error: CustomError.UsernameIncompatibleWithPattern,
      };
    }

    const newUserInstance = await this._userRepository.create(registrationDto);

    const userInDB = await this._userRepository.save(newUserInstance);

    const payload = { username: userInDB.username, id: userInDB.id };

    return {
      access_token: this._jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async logout() {
    return this._jwtService.sign({}, { expiresIn: 1 });
  }
}

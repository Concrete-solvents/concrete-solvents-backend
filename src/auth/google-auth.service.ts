// Libraries
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';
import { EmailEntity } from '@Email/entities/email.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

// User
import { UserEntity } from '@User/entities/user.entity';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Auth
import { GoogleUser } from '@Auth/interfaces/google-user.interface';

class GoogleAuthService {
  constructor(
    private readonly _jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
  ) {}

  async googleLogin({
    user,
  }: {
    user: GoogleUser;
  }): Promise<RegistrationResponse> {
    if (!user) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
        user: null,
      };
    }

    let userInDB = await this._userRepository.findOne({
      where: {
        socialId: `Google-${user.id}`,
      },
    });

    const email = await this._emailRepository.create({
      value: user.email,
    });

    if (!userInDB) {
      const newUser = await this._userRepository.create({
        username: `User-${uuidv4()}`,
        email,
        password: uuidv4(),
        socialId: `Google-${user.id}`,
        avatarUrl: user.avatarUrl,
      });
      userInDB = await this._userRepository.save(newUser);
    }

    return {
      isSuccess: true,
      user: {
        username: userInDB.username,
        id: userInDB.id,
        email: email.value,
        avatarUrl: userInDB.avatarUrl,
      },
    };
  }
}

export { GoogleAuthService };

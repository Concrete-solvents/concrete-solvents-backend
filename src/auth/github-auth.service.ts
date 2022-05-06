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
import { GithubUser } from '@Auth/interfaces/github-user.interface';

class GithubAuthService {
  constructor(
    private readonly _jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    @InjectRepository(EmailEntity)
    private readonly _emailRepository: Repository<EmailEntity>,
  ) {}

  async githubLogin(user: GithubUser): Promise<RegistrationResponse> {
    if (!user) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
        user: null,
      };
    }

    let userInDB = await this._userRepository.findOne({
      where: {
        socialId: `Github-${user.id}`,
      },
    });

    if (!userInDB) {
      const newUser = await this._userRepository.create({
        username: `User-${uuidv4()}`,
        email: null,
        password: uuidv4(),
        socialId: `Github-${user.id}`,
        avatarUrl: user.avatarUrl,
      });
      userInDB = await this._userRepository.save(newUser);
    }

    const userWithEmail = await this._userRepository.findOne({
      where: {
        id: userInDB.id,
      },
      relations: ['email'],
    });

    return {
      isSuccess: true,
      user: {
        username: userWithEmail.username,
        id: userWithEmail.id,
        email: userWithEmail.email.value,
        avatarUrl: userWithEmail.avatarUrl,
      },
    };
  }
}

export { GithubAuthService };

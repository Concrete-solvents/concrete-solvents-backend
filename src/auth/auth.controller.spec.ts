// Libraries
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

// Auth
import { AuthController } from '@Auth/auth.controller';
import { AuthService } from '@Auth/auth.service';
import { BASE_JWT_OPTION } from '@Auth/constants/base-jwt-options.constant';

// Common
import { CustomError } from '@Common/enums/custom-errors';

const moduleMocker = new ModuleMocker(global);

const JWT_TOKEN = 'test token for jest';

const testUser = {
  username: 'testUser',
  id: 12,
  email: 'example@v.z',
  avatarUrl: 'http://explimg.yy/15',
};

let res: {
  cookie: () => void;
  status: () => void;
} = {
  cookie: jest.fn(),
  status: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return { sign: jest.fn().mockReturnValue(JWT_TOKEN) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);

    res = {
      cookie: jest.fn(),
      status: jest.fn(),
    };
  });

  describe('login', () => {
    const loginDto = {
      username: 'testUser',
      password: '123321',
    };

    it('should return the result with the user and set a token in the cookie if the login was successful', async () => {
      const result = {
        isSuccess: true,
        user: testUser,
      };

      const res = {
        cookie: jest.fn(),
        status: jest.fn(),
      };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginDto, res as any)).toBe(result);
      expect(res.cookie).toBeCalledTimes(1);
      expect(res.cookie).lastCalledWith('jwt', JWT_TOKEN, BASE_JWT_OPTION);
      expect(res.status).toBeCalledTimes(0);
    });

    it('should return an error if the username or password is incorrect', async () => {
      const result = {
        isSuccess: false,
        error: CustomError.WrongUsernameOrPassword,
        user: null,
      };

      const res = {
        cookie: jest.fn(),
        status: jest.fn(),
      };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginDto, res as any)).toBe(result);
      expect(res.cookie).toBeCalledTimes(0);
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).lastCalledWith(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('registration', () => {
    const registrationDto = {
      username: testUser.username,
      email: testUser.email,
      password: '123213',
    };

    it('should return the result with the user and set a token in the cookie if the registration was successful', async () => {
      const result = {
        isSuccess: true,
        user: testUser,
      };

      jest.spyOn(authService, 'registration').mockResolvedValue(result);

      expect(
        await authController.registration(registrationDto, res as any),
      ).toBe(result);
      expect(res.status).toBeCalledTimes(0);
      expect(res.cookie).toBeCalledTimes(1);
      expect(res.cookie).toBeCalledWith('jwt', JWT_TOKEN, BASE_JWT_OPTION);
    });

    it('should return error if the user with given username already exists', async () => {
      const result = {
        isSuccess: false,
        error: CustomError.UserWithGivenUsernameAlreadyExist,
        user: null,
      };

      jest.spyOn(authService, 'registration').mockResolvedValue(result);

      expect(
        await authController.registration(registrationDto, res as any),
      ).toBe(result);
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(HttpStatus.CONFLICT);
      expect(res.cookie).toBeCalledTimes(0);
    });

    it('should return error if the user with given email already exists', async () => {
      const result = {
        isSuccess: false,
        error: CustomError.UserWithGivenEmailAlreadyExist,
        user: null,
      };

      jest.spyOn(authService, 'registration').mockResolvedValue(result);

      expect(
        await authController.registration(registrationDto, res as any),
      ).toBe(result);
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(HttpStatus.CONFLICT);
      expect(res.cookie).toBeCalledTimes(0);
    });

    it('should return error if the username is not compatible with the template', async () => {
      const result = {
        isSuccess: false,
        error: CustomError.UsernameIncompatibleWithPattern,
        user: null,
      };

      jest.spyOn(authService, 'registration').mockResolvedValue(result);

      expect(
        await authController.registration(registrationDto, res as any),
      ).toBe(result);
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.cookie).toBeCalledTimes(0);
    });
  });

  describe('logout', () => {
    it('should set a token on the cookie that ends in 1s', async () => {
      const result = { isSuccess: true };

      expect(await authController.logout(res as any)).toEqual(result);
      expect(res.status).toBeCalledTimes(0);
      expect(res.cookie).toBeCalledTimes(1);
      expect(res.cookie).toBeCalledWith('jwt', '', {
        ...BASE_JWT_OPTION,
        ...{ maxAge: 1 },
      });
    });
  });
});

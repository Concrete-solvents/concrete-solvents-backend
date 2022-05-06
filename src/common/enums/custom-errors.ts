export enum CustomError {
  UserWithGivenUsernameAlreadyExist = 'User with given username already exist',
  UserWithGivenEmailAlreadyExist = 'User with given email already exist',
  PermissionError = 'Permission error',
  WrongUsernameOrPassword = 'Wrong username or password',
  UsernameIncompatibleWithPattern = 'The username is not compatible with the template',
  UserDoesNotExist = 'The user does not exist',
  EmailDoesNotLinked = 'The email does not linked',
  EmailAlreadyConfirmed = 'The email already confirmed',
  EmailNotFoundOrNotConfirmed = 'Email not found or not confirmed',
}

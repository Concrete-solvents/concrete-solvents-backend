export enum CustomError {
  PermissionError = 'Permission error',
  WrongLoginOrPassword = 'Wrong login or password',
  WrongPassword = 'Wrong password',
  LoginIncompatibleWithPattern = 'The login is not compatible with the template',
  UserDoesNotExist = 'The user does not exist',
  InviteDoesNotExist = 'The invite does not exist',
  EmailDoesNotLinked = 'The email does not linked',
  EmailAlreadyConfirmed = 'The email already confirmed',
  EmailNotFoundOrNotConfirmed = 'Email not found or not confirmed',
  EmailIsAlreadyBusy = 'The email is already busy',
  LoginIsAlreadyBusy = 'The login is already busy',
  GroupDoesNotExist = 'The group does not exist',
  UserAlreadyInGroup = 'The user already in the group',
  UserAlreadyInvited = 'The user already invited',
  UserDoesNotInGroup = 'The user does not in the group',
  OwnerCantLeaveFromGroup = 'The owner cant leave from the group',
  UserAlreadyModerator = 'The user is already a moderator',
  UserNotModerator = 'The user is not a moderator',
  JoinRequestDoesNotExist = 'The join request does not exist',
  RequestToJoinGroupAlreadyExist = 'the request to join the group is already exist',
  GroupNameAlreadyBusy = 'The group name is already busy',
}

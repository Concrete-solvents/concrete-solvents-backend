class GetUserProfileQuery {
  readonly userId: number;
  readonly currentUser?: number;

  constructor(props: GetUserProfileQuery) {
    this.userId = props.userId;
    this.currentUser =
      props.currentUser === props.userId ? undefined : props.currentUser;
  }
}

export { GetUserProfileQuery };

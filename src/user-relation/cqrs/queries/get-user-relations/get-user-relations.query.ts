class GetUserRelationsQuery {
  readonly givenUserId: number;
  readonly currentUserId: number;

  constructor(props: GetUserRelationsQuery) {
    this.givenUserId = props.givenUserId;
    this.currentUserId = props.currentUserId;
  }
}

export { GetUserRelationsQuery };

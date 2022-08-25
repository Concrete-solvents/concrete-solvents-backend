class GetGroupByIdQuery {
  readonly groupId: number;
  readonly userId: number;

  constructor(props: GetGroupByIdQuery) {
    this.groupId = props.groupId;
    this.userId = props.userId;
  }
}

export { GetGroupByIdQuery };

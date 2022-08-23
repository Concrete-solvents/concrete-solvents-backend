class GetJoinRequestReceivedByGroupQuery {
  readonly groupId: number;
  readonly userId: number;

  constructor(props: GetJoinRequestReceivedByGroupQuery) {
    this.groupId = props.groupId;
    this.userId = props.userId;
  }
}

export { GetJoinRequestReceivedByGroupQuery };

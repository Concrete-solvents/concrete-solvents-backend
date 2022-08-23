class GetSentByGroupInvitesQuery {
  readonly userId: number;
  readonly groupId: number;

  constructor(props: GetSentByGroupInvitesQuery) {
    this.groupId = props.groupId;
    this.userId = props.userId;
  }
}

export { GetSentByGroupInvitesQuery };

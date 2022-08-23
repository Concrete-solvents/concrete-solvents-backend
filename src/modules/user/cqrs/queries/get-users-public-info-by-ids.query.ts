class GetUsersPublicInfoByIdsQuery {
  readonly userIds: number[];

  constructor(props: GetUsersPublicInfoByIdsQuery) {
    this.userIds = props.userIds;
  }
}

export { GetUsersPublicInfoByIdsQuery };

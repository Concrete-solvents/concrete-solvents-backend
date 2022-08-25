class GetGroupsByUserIdQuery {
  readonly userId: number;
  readonly limit: number;
  readonly page: number;
  readonly filter: string;

  constructor(props: GetGroupsByUserIdQuery) {
    this.userId = props.userId;
    this.limit = props.limit;
    this.page = props.page;
    this.filter = props.filter;
  }
}

export { GetGroupsByUserIdQuery };

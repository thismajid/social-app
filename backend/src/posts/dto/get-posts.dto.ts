export class GetPostsDto {
  page?: number = 1;
  limit?: number = 8;
  creator?: boolean = false;
  comments?: boolean = false;
}

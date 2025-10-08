import { CommentForPostFromBd, CommentForPostFromBdCommentatorInfo } from "../service/interfaces";

export interface CreateCommentForPostRepository extends CommentForPostFromBd {
  postId: string;
}
import { CommentForPostFromBdCommentatorInfo } from "../commentsService/interface";

export interface CommentForPostForBd {
  content: string;
  commentatorInfo: CommentForPostFromBdCommentatorInfo;
  createdAt: string;
  postId: string;
}


import { CommentForPostFromBdCommentatorInfo } from "../commentsService/interface";
import { ObjectId } from "mongodb";

export interface CommentForPostForBd {
  content: string;
  commentatorInfo: CommentForPostFromBdCommentatorInfo;
  createdAt: string;
  postId: string;
}

export interface MappedCommentForPostForBd  extends Omit<CommentForPostForBd, "postId"> {
  id: string;
}

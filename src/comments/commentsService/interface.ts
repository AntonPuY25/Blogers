import { CreateCommentForPostProps } from "../../posts/routers/interface";



export interface CreateCommentForPostFromServiceProps
  extends CreateCommentForPostProps {
  userId: string;
  userLogin: string;
  postId: string;
}

export interface CommentForPostFromBdCommentatorInfo
  extends Omit<CreateCommentForPostFromServiceProps, "content" | 'postId'> {}

export interface UpdatedCommentServiceProps {
  commentId: string;
  content: string;
  userId: string;
}
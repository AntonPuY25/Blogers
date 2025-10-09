import { WithId } from "mongodb";
import { CommentForPostForBd } from "./interface";

export const getCurrentCommentWithoutObjectIdAndPostId = ({
  postId,
  _id,
  ...comment
}: WithId<CommentForPostForBd>) => {
  return {
    id: _id,
    ...comment,
  };
};

import { WithId } from "mongodb";
import { CommentForPostForBd, MappedCommentForPostForBd } from "./interface";

export const getCurrentCommentWithoutObjectIdAndPostId = ({
  postId,
  _id,
  ...comment
}: WithId<CommentForPostForBd>): MappedCommentForPostForBd => {
  return {
    id: _id,
    ...comment,
  };
};

import { WithId } from "mongodb";
import { CommentForPostForBd, MappedCommentForPostForBd } from "./interface";

export const getCurrentCommentWithoutObjectIdAndPostId = ({
  postId,
  _id,
  ...comment
}: WithId<CommentForPostForBd>): MappedCommentForPostForBd => ({
  id: _id,
  ...comment,
});

export const getCurrentCommentsForPostWithoutObjectIdAndPostId = (
  comments: WithId<CommentForPostForBd>[],
): MappedCommentForPostForBd[] => {
  return comments.map(({ postId, _id, ...comment }) => ({
    id: _id,
    ...comment,
  }));
};

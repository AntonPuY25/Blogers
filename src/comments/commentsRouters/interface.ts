export interface GetCurrentCommentParams extends Record<string, string> {
  commentId: string;
}


export interface UpdateCurrentComment  {
  content: string;
}
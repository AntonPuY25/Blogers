import {PostType} from "../db/types";

export interface CreatePostRequest extends Omit<PostType, 'id' | 'blogName'> {}
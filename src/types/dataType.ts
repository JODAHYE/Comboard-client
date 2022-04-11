export type BoardType = {
  _id: string;
  master: string;
  access: string;
  bgimg?: string;
  create_date: number;
  description?: string;
  secretNumber?: string;
  title: string;
  __v?: number;
  postCount: number;
  lastPostDate?: number;
};
export type PostType = {
  _id: string;
  title: string;
  writer: string;
  content: string;
  create_date: number;
  board: string;
  like?: number;
  dislike?: number;
  hits?: number;
  writer_name: string;
  comments_count: number;
};
export type CommentType = {
  _id: string;
  writer: string;
  post: string;
  writer_name: string;
  content: string;
  create_date: number;
  childComment?: CommentType[];
  isChild?: boolean;
  reply?: string;
  reply_user?: string;
  reply_name?: string;
  reply_comment?: string;
};
export type AlertType = {
  _id: string;
  user?: string;
  createDate: number;
  description: string;
  subdescription: string;
  detailUrl: string;
  isRead: boolean;
};

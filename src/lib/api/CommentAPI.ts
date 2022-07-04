import { axiosInstance } from ".";

type BodyType = {
  parentCommentId?: string;
  post: string;
  writer_name: string;
  content: string;
  createDate: number;
  reply_user?: string;
  reply_name?: string;
  reply_comment?: string;
};

const CommentAPI = {
  getCommentList: async (postId: string) => {
    const response = await axiosInstance.get("/comment/list", {
      params: {
        postId,
      },
    });
    const data = await response.data.commentList;
    return data;
  },

  createComment: async (body: BodyType) => {
    const response = await axiosInstance.post("/comment/create", body);
    const data = await response.data;
    return data;
  },

  updateComment: async (commentId: string, content: string) => {
    const response = await axiosInstance.patch("/comment/update", {
      commentId,
      content,
    });
    const data = await response.data.comment;
    return data;
  },

  deleteComment: async (postId: string, commentId: string) => {
    const response = await axiosInstance.delete("/comment/delete", {
      params: {
        postId,
        commentId,
      },
    });
    const data = await response.data;
    return data;
  },

  createReply: async (body: BodyType) => {
    const response = await axiosInstance.post("/comment/reply/create", body);
    const data = await response.data;
    return data;
  },

  getReplyList: async (parentCommentId: string) => {
    const response = await axiosInstance.get("/comment/reply/list", {
      params: {
        parentCommentId: parentCommentId,
      },
    });
    const data = await response.data.commentList;
    return data;
  },
};
export default CommentAPI;

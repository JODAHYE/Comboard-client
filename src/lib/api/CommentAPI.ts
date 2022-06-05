import Axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

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
const axiosInstance = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/comment`,
});

const CommentAPI = {
  getCommentList: async (postId: string) => {
    const response = await axiosInstance.get("/list", {
      params: {
        postId,
      },
    });
    const data = await response.data.commentList;
    return data;
  },

  createComment: async (body: BodyType) => {
    const response = await axiosInstance.post("/create", body, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = await response.data;
    return data;
  },

  updateComment: async (commentId: string, content: string) => {
    const response = await axiosInstance.patch(
      "/update",
      {
        commentId,
        content,
      },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    const data = await response.data.comment;
    return data;
  },

  deleteComment: async (postId: string, commentId: string) => {
    const response = await axiosInstance.delete("/delete", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        postId,
        commentId,
      },
    });
    const data = await response.data;
    return data;
  },

  createReply: async (body: BodyType) => {
    const response = await axiosInstance.post("/reply/create", body, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = await response.data;
    return data;
  },

  getReplyList: async (parentCommentId: string) => {
    const response = await axiosInstance.get("/reply/list", {
      params: {
        parentCommentId: parentCommentId,
      },
    });
    const data = await response.data.commentList;
    return data;
  },
};
export default CommentAPI;

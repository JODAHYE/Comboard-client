import Axios from "axios";

type BodyType = {
  title: string;
  writer: string;
  content: string;
  create_date: number;
  board: string;
};

const axiosInstance = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/post`,
  withCredentials: true,
});

const PostAPI = {
  getPostList: async (boardId: string, skip: number, sort: string) => {
    const response = await axiosInstance.get("/list", {
      params: {
        boardId: boardId,
        skip: skip,
        sort,
      },
    });
    const data = await response.data.postList;
    return data;
  },

  getUserPostList: async (userId: string, skip: number) => {
    const response = await axiosInstance.get("/user_list", {
      params: {
        userId,
        skip,
      },
    });
    const data = await response.data;
    return data;
  },

  getPostDetail: async (postId: string) => {
    const response = await axiosInstance.get("/get", {
      params: {
        postId: postId,
      },
    });
    const data = await response.data;
    return data;
  },

  createPost: async (body: BodyType) => {
    const response = await axiosInstance.post("/create", body);
    const data = await response.data;
    return data;
  },

  updatePost: async (body: BodyType, postId: string) => {
    const response = await axiosInstance.patch("/update", body, {
      params: {
        postId: postId,
      },
    });
    const data = await response.data;
    return data;
  },

  deletePost: async (postId: string, boardId: string) => {
    const response = await axiosInstance.delete("/delete", {
      params: {
        postId,
        boardId,
      },
    });
    const data = await response.data;
    return data;
  },

  likePost: async (postId: string) => {
    const response = await axiosInstance.patch("/like", { postId });
    const data = await response.data;
    return data;
  },

  dislikePost: async (postId: string) => {
    const response = await axiosInstance.patch("/dislike", { postId });
    const data = await response.data;
    return data;
  },

  increasePostView: async (postId: string) => {
    const response = await axiosInstance.patch("/increase/view", { postId });
    const data = await response.data;
    return data;
  },
};
export default PostAPI;

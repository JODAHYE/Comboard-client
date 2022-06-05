import Axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

type BodyType = {
  title: string;
  writer: string;
  content: string;
  create_date: number;
  board: string;
};

const axiosInstance = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/post`,
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
    const response = await axiosInstance.post("/create", body, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = await response.data;
    return data;
  },

  updatePost: async (body: BodyType, postId: string) => {
    const response = await axiosInstance.patch("/update", body, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        postId: postId,
      },
    });
    const data = await response.data;
    return data;
  },

  deletePost: async (postId: string, boardId: string) => {
    const response = await axiosInstance.delete("/delete", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        postId,
        boardId,
      },
    });
    const data = await response.data;
    return data;
  },

  likePost: async (postId: string) => {
    const response = await axiosInstance.patch(
      "/like",
      { postId },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    const data = await response.data;
    return data;
  },

  dislikePost: async (postId: string) => {
    const response = await axiosInstance.patch(
      "/dislike",
      { postId },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    const data = await response.data;
    return data;
  },
};
export default PostAPI;

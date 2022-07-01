import Axios from "axios";

const axiosInstance = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/user`,
  withCredentials: true,
});

export const UserAPI = {
  signUp: async (info: any) => {
    const response = await axiosInstance.post("/signup", info);
    const data = await response.data;
    return data;
  },

  auth: async () => {
    const response = await axiosInstance.get("/auth");
    const data = await response.data;
    return data;
  },

  login: async (info: object) => {
    const response = await axiosInstance.post("/login", info);
    const data = await response.data;
    return data;
  },

  kakaoLogin: async (code: string) => {
    const response = await axiosInstance.post("/kakaologin", {
      code,
    });
    const data = await response.data;
    return data;
  },

  logout: async () => {
    const response = await axiosInstance.get("/logout");
    const data = await response.data;
    return data;
  },

  addBookmarkBoard: async (boardId: string) => {
    const response = await axiosInstance.patch("/bookmark/add", { boardId });
    const data = await response.data;
    return data;
  },

  deleteBookmarkBoard: async (boardId: string) => {
    const response = await axiosInstance.patch("/bookmark/delete", { boardId });
    const data = await response.data;
    return data;
  },

  getCreatedBoardList: async () => {
    const response = await axiosInstance.get("/board/created_list");
    const data = await response.data;
    return data;
  },

  getBookmarkList: async () => {
    const response = await axiosInstance.get("/bookmark/list");
    const data = await response.data.bookmarkBoardList;
    return data;
  },

  updateProfileImg: async (imgUrl: string) => {
    const response = await axiosInstance.patch("/update/image", { imgUrl });
    const data = await response.data.profileImage;
    return data;
  },

  updateNickname: async (nickname: string) => {
    const response = await axiosInstance.patch("/update/nickname", {
      nickname,
    });
    const data = await response.data.nickname;
    return data;
  },

  updatePostLock: async (value: boolean) => {
    const response = await axiosInstance.patch("/update/post_lock", { value });
    const data = await response.data.postLock;
    return data;
  },

  getUserDetail: async (userId: string) => {
    const response = await axiosInstance.get("/detail", {
      params: { userId },
    });
    const data = await response.data;
    return data;
  },

  scrapPost: async (postId: string) => {
    const response = await axiosInstance.patch("/scrap/add", { postId });
    const data = await response.data;
    return data;
  },

  deleteScrapPost: async (postId: string) => {
    const response = await axiosInstance.patch("/scrap/delete", { postId });
    const data = await response.data;
    return data;
  },

  getScrapPostList: async (skip: number) => {
    const response = await axiosInstance.get("/scrap/list", {
      params: {
        skip,
      },
    });
    const data = await response.data.postList;
    return data;
  },

  getMyPostList: async (skip: number) => {
    const response = await axiosInstance.get("/post/list", {
      params: {
        skip,
      },
    });
    const data = await response.data.postList;
    return data;
  },

  getMyPostCount: async () => {
    const response = await axiosInstance.get("/post_count");
    const data = await response.data.postCount;
    return data;
  },

  getMyCommentList: async (skip: number) => {
    const response = await axiosInstance.get("/comment/list", {
      params: {
        skip,
      },
    });
    const data = await response.data.list;
    return data;
  },

  getMyCommentCount: async () => {
    const response = await axiosInstance.get("/comment_count");
    const data = await response.data.CommentCount;
    return data;
  },
};
export default UserAPI;

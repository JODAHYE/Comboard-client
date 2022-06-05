import Axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const axiosInstance = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/user`,
});

export const UserAPI = {
  signUp: async (info: any) => {
    const response = await axiosInstance.post("/signup", info);
    const data = await response.data;
    return data;
  },

  auth: async () => {
    const response = await axiosInstance.get("/auth", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
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

  logout: async (kakaoAccessToken: string | undefined) => {
    const response = await axiosInstance.get("/logout", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        kakaoAccessToken: kakaoAccessToken,
      },
    });
    const data = await response.data;
    return data;
  },

  addBookmarkBoard: async (boardId: string) => {
    const response = await axiosInstance.patch(
      "/bookmark/add",
      { boardId },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    const data = await response.data;
    return data;
  },

  deleteBookmarkBoard: async (boardId: string) => {
    const response = await axiosInstance.patch(
      "/bookmark/delete",
      { boardId },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    const data = await response.data;
    return data;
  },

  getCreatedBoardList: async () => {
    const response = await axiosInstance.get("/board/created_list", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = await response.data;
    return data;
  },

  getBookmarkList: async () => {
    const response = await axiosInstance.get("/bookmark/list", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = await response.data.bookmarkBoardList;
    return data;
  },

  updateProfileImg: async (imgUrl: string) => {
    const response = await axiosInstance.patch(
      "/update/image",
      { imgUrl },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    const data = await response.data.profileImage;
    return data;
  },

  updateNickname: async (nickname: string) => {
    const response = await axiosInstance.patch(
      "/update/nickname",
      { nickname },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    const data = await response.data.nickname;
    return data;
  },

  updatePostLock: async (value: boolean) => {
    const response = await axiosInstance.patch(
      "/update/post_lock",
      { value },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
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
    const response = await axiosInstance.patch(
      "/scrap/add",
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

  deleteScrapPost: async (postId: string) => {
    const response = await axiosInstance.patch(
      "/scrap/delete",
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

  getScrapPostList: async (skip: number) => {
    const response = await axiosInstance.get("/scrap/list", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        skip,
      },
    });
    const data = await response.data.postList;
    return data;
  },

  getMyPostList: async (skip: number) => {
    const response = await axiosInstance.get("/post/list", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        skip,
      },
    });
    const data = await response.data.postList;
    return data;
  },

  getMyPostCount: async () => {
    const response = await axiosInstance.get("/post_count", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = await response.data.postCount;
    return data;
  },

  getMyCommentList: async (skip: number) => {
    const response = await axiosInstance.get("/comment/list", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        skip,
      },
    });
    const data = await response.data.list;
    return data;
  },

  getMyCommentCount: async () => {
    const response = await axiosInstance.get("/comment_count", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = await response.data.CommentCount;
    return data;
  },
};
export default UserAPI;

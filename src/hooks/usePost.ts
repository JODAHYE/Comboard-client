import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();
type BodyType = {
  title: string;
  writer: string;
  content: string;
  create_date: number;
  board: string;
};

export function usePost() {
  const params = useParams();
  const getPostList = async (boardId: string, skip: number, sort: string) => {
    const response = await axios.get(`/board/${params.id}/list`, {
      params: {
        boardId: boardId,
        skip: skip,
        sort,
      },
    });
    return response.data.postList;
  };

  const createPost = async (body: BodyType) => {
    if (!cookies.get("accessToken")) return alert("로그인이 필요합니다.");
    const response = await axios.post(`/post/create`, body, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    return response.data;
  };

  const updatePost = async (body: BodyType) => {
    const response = await axios.patch(`/post/update`, body, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        postId: params.postId,
      },
    });
    const data = await response.data;
    return data;
  };

  const deletePost = async () => {
    const response = await axios.delete(`/post/delete`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        postId: params.postId,
        boardId: params.id,
      },
    });
    const data = await response.data;
    return data;
  };

  const getPostDetail = async () => {
    const response = await axios.get(`/post/get`, {
      params: {
        postId: params.postId,
      },
    });
    const post = response.data.post;
    return post;
  };

  const isExistPost = async (postId: string) => {
    const response = await axios.get(`/post/get`, {
      params: {
        postId: postId,
      },
    });
    const data = await response.data;
    if (!data.success) {
      alert("해당 게시글이 존재하지 않습니다.");
      return false;
    }
    return true;
  };

  const clickLike = async (postId: string) => {
    if (!cookies.get("accessToken")) return alert("로그인이 필요합니다.");
    await axios.patch(
      `/post/like`,
      { postId },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
  };

  const clickDislike = async (postId: string) => {
    if (!cookies.get("accessToken")) return alert("로그인이 필요합니다.");
    await axios.patch(
      `/post/dislike`,
      { postId },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
  };

  const clickScrap = async () => {
    await axios
      .patch(
        `/user/scrap/add`,
        { postId: params.postId },
        {
          headers: {
            Authorization: cookies.get("accessToken"),
          },
        }
      )
      .then(() => {
        return alert("스크랩");
      });
  };

  const scrapDelete = async () => {
    await axios.patch(
      `/user/scrap/delete`,
      { postId: params.postId },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
  };

  const getMyPostList = async (skip: number) => {
    const response = await axios.get(`/user/post/list`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        skip,
      },
    });
    const data = await response.data.postList;
    return data;
  };

  const getMyPostCount = async () => {
    if (!cookies.get("accessToken")) return;
    const response = await axios.get(`/user/post_count`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = await response.data.postCount;
    return data;
  };
  const deleteMyPost = async (postList: string[]) => {
    for (let i = 0; i < postList.length; i++) {
      const idValue = postList[i].split("-");
      axios.delete(`/post/delete`, {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
        params: {
          postId: idValue[0],
          boardId: idValue[1],
        },
      });
    }
  };
  const getScrapList = async (skip: number) => {
    const response = await axios.get(`/user/scrap/list`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        skip,
      },
    });
    const data = await response.data.postList;
    return data;
  };
  const clearScrap = async (postList: string[]) => {
    for (let i = 0; i < postList.length; i++) {
      axios.patch(
        `/user/scrap/delete`,
        { postId: postList[i] },
        {
          headers: {
            Authorization: cookies.get("accessToken"),
          },
        }
      );
    }
  };
  const getUserPostList = async (userId: string, skip: number) => {
    const response = await axios.get(`/post/user_list`, {
      params: {
        userId: userId,
        skip: skip,
      },
    });
    return response.data;
  };
  return {
    getPostList,
    createPost,
    getPostDetail,
    updatePost,
    clickLike,
    clickDislike,
    deletePost,
    clickScrap,
    scrapDelete,
    getMyPostCount,
    getMyPostList,
    deleteMyPost,
    getScrapList,
    clearScrap,
    getUserPostList,
    isExistPost,
  };
}

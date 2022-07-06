import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { RootState } from "../app/store";
import PostAPI from "../lib/api/PostAPI";
import UserAPI from "../lib/api/UserAPI";

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
  const { is_auth } = useSelector((state: RootState) => state.user);

  const getPostList = async (boardId: string, skip: number, sort: string) => {
    const data = await PostAPI.getPostList(boardId, skip, sort);
    return data;
  };

  const createPost = async (body: BodyType) => {
    if (!is_auth) return alert("로그인이 필요합니다.");
    const data = await PostAPI.createPost(body);
    return data;
  };

  const updatePost = async (body: BodyType) => {
    const data = await PostAPI.updatePost(body, params.postId as string);
    return data;
  };

  const deletePost = async () => {
    const data = await PostAPI.deletePost(
      params.postId as string,
      params.id as string
    );
    return data;
  };

  const getPostDetail = async () => {
    const data = await PostAPI.getPostDetail(params.postId as string);
    return data.post;
  };

  const isExistPost = async (postId: string) => {
    const data = await PostAPI.getPostDetail(postId);
    if (!data.success) {
      alert("해당 게시글이 존재하지 않습니다.");
      return false;
    }
    return true;
  };

  const clickLike = async (postId: string) => {
    if (!is_auth) return alert("로그인이 필요합니다.");
    const data = await PostAPI.likePost(postId);
    return data;
  };

  const clickDislike = async (postId: string) => {
    if (!is_auth) return alert("로그인이 필요합니다.");
    const data = await PostAPI.dislikePost(postId);
    return data;
  };

  const scrapPost = async () => {
    if (!is_auth) return alert("로그인이 필요합니다.");
    const data = await UserAPI.scrapPost(params.postId as string);
    return data;
  };

  const deleteScrapPost = async () => {
    if (!is_auth) return alert("로그인이 필요합니다.");
    const data = await UserAPI.deleteScrapPost(params.postId as string);
    return data;
  };

  const getMyPostList = async (skip: number) => {
    const data = await UserAPI.getMyPostList(skip);
    return data;
  };

  const getMyPostCount = async () => {
    if (!is_auth) return;
    const data = await UserAPI.getMyPostCount();
    return data;
  };

  const deleteMyPost = async (postList: string[]) => {
    for (let i = 0; i < postList.length; i++) {
      const idValue = postList[i].split("-");
      await PostAPI.deletePost(idValue[0], idValue[1]);
    }
  };

  const getScrapList = async (skip: number) => {
    const data = await UserAPI.getScrapPostList(skip);
    return data;
  };

  const clearScrap = async (postList: string[]) => {
    for (let i = 0; i < postList.length; i++) {
      UserAPI.deleteScrapPost(postList[i]);
    }
  };

  const getUserPostList = async (userId: string, skip: number) => {
    const data = await PostAPI.getUserPostList(userId, skip);
    return data;
  };

  const increasePostView = async (postId: string) => {
    const data = await PostAPI.increasePostView(postId);
    cookies.set(postId, postId, {
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return data;
  };

  return {
    getPostList,
    createPost,
    getPostDetail,
    updatePost,
    clickLike,
    clickDislike,
    deletePost,
    scrapPost,
    deleteScrapPost,
    getMyPostCount,
    getMyPostList,
    deleteMyPost,
    getScrapList,
    clearScrap,
    getUserPostList,
    isExistPost,
    increasePostView,
  };
}

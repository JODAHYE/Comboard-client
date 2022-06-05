import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import ALertAPI from "../lib/api/AlertAPI";
import CommentAPI from "../lib/api/CommentAPI";
import UserAPI from "../lib/api/UserAPI";

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

export function useComment() {
  const params = useParams();

  const createComment = async (body: BodyType) => {
    const data = await CommentAPI.createComment(body);
    const alertBody = {
      postId: body.post,
      createDate: body.createDate,
      description: "내 게시글에 댓글이 달렸습니다.",
      subdescription: body.content,
      detailUrl: `/board/${params.id}/${params.postId}`,
    };
    await ALertAPI.createAlert(alertBody);
    return data;
  };

  const getReplyList = async (parentCommentId: string) => {
    const data = await CommentAPI.getReplyList(parentCommentId);
    return data;
  };

  const replyCreate = async (body: BodyType) => {
    const data = await CommentAPI.createReply(body);
    const alertBody = {
      postId: body.post,
      createDate: body.createDate,
      description: "내 게시글에 댓글이 달렸습니다.",
      subdescription: body.content,
      detailUrl: `/board/${params.id}/${params.postId}`,
    };
    const alertReplyBody = {
      replyUser: body.reply_user as string,
      createDate: body.createDate,
      description: "내 댓글에 답글이 달렸습니다.",
      subdescription: body.content,
      detailUrl: `/board/${params.id}/${params.postId}`,
    };
    await ALertAPI.createAlert(alertBody);
    await ALertAPI.createReplyAlert(alertReplyBody);
    return data;
  };

  const updateComment = async (commentId: string, content: string) => {
    const data = await CommentAPI.updateComment(commentId, content);
    return data;
  };

  const deleteComment = async (commentId: string) => {
    const data = await CommentAPI.deleteComment(
      params.postId as string,
      commentId
    );
    return data;
  };

  const getMyCommentList = async (skip: number) => {
    const data = await UserAPI.getMyCommentList(skip);
    return data;
  };

  const getMyCommentCount = async () => {
    if (!cookies.get("accessToken")) return;
    const data = await UserAPI.getMyCommentCount();
    return data;
  };

  const deleteMyComment = async (commentList: string[]) => {
    for (let i = 0; i < commentList.length; i++) {
      const idValue = commentList[i].split("-");
      CommentAPI.deleteComment(idValue[1], idValue[0]);
    }
  };

  return {
    createComment,
    getReplyList,
    updateComment,
    deleteComment,
    replyCreate,
    getMyCommentList,
    getMyCommentCount,
    deleteMyComment,
  };
}

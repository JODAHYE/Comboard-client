import axios from "axios";
import { useParams } from "react-router-dom";
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
export function useComment() {
  const params = useParams();
  const commentCreate = async (body: BodyType) => {
    const response = await axios.post(`/comment/create`, body, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const alertBody = {
      postId: body.post,
      createDate: body.createDate,
      description: "내 게시글에 댓글이 달렸습니다.",
      subdescription: body.content,
      detailUrl: `/board/${params.id}/${params.postId}`,
    };
    await axios.post("https://comboard.herokuapp.com/alert/create", alertBody);
    return response.data;
  };

  const getReplyList = async (parentCommentId: string) => {
    const response = await axios.get(`/comment/reply/list`, {
      params: {
        parentCommentId: parentCommentId,
      },
    });
    const data = response.data.commentList;
    return data;
  };
  const replyCreate = async (body: BodyType) => {
    const response = await axios.post(`/comment/reply/create`, body, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const alertBody = {
      postId: body.post,
      createDate: body.createDate,
      description: "내 게시글에 댓글이 달렸습니다.",
      subdescription: body.content,
      detailUrl: `/board/${params.id}/${params.postId}`,
    };
    const alertReplyBody = {
      replyUser: body.reply_user,
      createDate: body.createDate,
      description: "내 댓글에 답글이 달렸습니다.",
      subdescription: body.content,
      detailUrl: `/board/${params.id}/${params.postId}`,
    };
    await axios.post(`/alert/create`, alertBody);
    await axios.post(`/alert/create_reply`, alertReplyBody);
    return response.data;
  };

  const commentUpdate = async (commentId: string, content: string) => {
    const response = await axios.patch(
      `/comment/update`,
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
    return response.data.comment;
  };

  const commentDelete = async (commentId: string) => {
    const response = await axios.delete(`/comment/delete`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        postId: params.postId,
        commentId,
      },
    });
    return response.data;
  };

  const getMyCommentList = async (skip: number) => {
    const response = await axios.get(`/user/comment/list`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        skip,
      },
    });
    const data = await response.data.list;
    return data;
  };
  const getMyCommentCount = async () => {
    if (!cookies.get("accessToken")) return;
    const response = await axios.get(`/user/comment_count`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = await response.data.CommentCount;
    return data;
  };
  const deleteMyComment = async (commentList: string[]) => {
    for (let i = 0; i < commentList.length; i++) {
      const idValue = commentList[i].split("-");
      axios.delete(`/comment/delete`, {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
        params: {
          commentId: idValue[0],
          postId: idValue[1],
        },
      });
    }
  };
  return {
    commentCreate,
    getReplyList,
    commentUpdate,
    commentDelete,
    replyCreate,
    getMyCommentList,
    getMyCommentCount,
    deleteMyComment,
  };
}

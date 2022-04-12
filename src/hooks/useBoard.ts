import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
type GetBodyType = {
  access: string;
  skip: number;
};

type CreateBodyType = {
  master: string;
  title: string;
  description?: string;
  access: string;
  secretNumber?: string;
  formData?: object;
  bgimg?: string;
};

export function useBoard() {
  const getBoardList = async (body: GetBodyType) => {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/board/list`,
      {
        params: {
          access: body.access,
          skip: body.skip,
        },
      }
    );
    const data = response.data.list;
    return data;
  };

  const createBoard = async (body: CreateBodyType) => {
    if (body.bgimg) {
      const upload_response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/upload/image`,
        body.formData
      );
      body.bgimg = upload_response.data.img_url;
    }
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/board/create`,
      body,
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    return response.data;
  };
  const updateBoard = async (boardId: string, body: CreateBodyType) => {
    if (body.bgimg) {
      const upload_response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/upload/image`,
        body.formData
      );
      body.bgimg = upload_response.data.img_url;
    }
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/board/update`,
      body,
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
        params: {
          boardId,
        },
      }
    );
    return response.data;
  };

  const deleteBoard = async (boardId: string) => {
    await axios.delete(`${process.env.REACT_APP_SERVER_URL}/board/delete`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        boardId,
      },
    });
  };

  const bookmarkBoard = async (boardId: string) => {
    await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/user/bookmark/add`,
      { boardId },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
  };
  const bookmarkBoardDelete = async (boardId: string) => {
    await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}/user/bookmark/delete`,
      { boardId },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
  };
  const isExistBoard = async (boardId: string) => {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/board/${boardId}`
    );
    const data = await response.data;
    if (!data.success) {
      alert("해당 게시판이 존재하지 않습니다.");
      return false;
    }
    return true;
  };
  return {
    getBoardList,
    createBoard,
    bookmarkBoard,
    bookmarkBoardDelete,
    deleteBoard,
    isExistBoard,
    updateBoard,
  };
}

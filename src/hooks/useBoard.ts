import BoardAPI from "../lib/api/BoardAPI";
import UploadAPI from "../lib/api/UploadAPI";
import UserAPI from "../lib/api/UserAPI";

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
    const data = await BoardAPI.getBoardList(body);
    return data.list;
  };

  const createBoard = async (body: CreateBodyType) => {
    if (body.formData) {
      body.bgimg = await UploadAPI.imageUpload(body.formData);
    }
    const data = await BoardAPI.createBoard(body);
    return data;
  };

  const updateBoard = async (boardId: string, body: CreateBodyType) => {
    if (body.formData) {
      body.bgimg = await UploadAPI.imageUpload(body.formData);
    }
    const data = await BoardAPI.updateBoard(boardId, body);
    return data;
  };

  const deleteBoard = async (boardId: string) => {
    BoardAPI.deleteBoard(boardId);
  };

  const addBookmarkBoard = async (boardId: string) => {
    UserAPI.addBookmarkBoard(boardId);
  };

  const deleteBookmarkBoard = async (boardId: string) => {
    UserAPI.deleteBookmarkBoard(boardId);
  };

  const isExistBoard = async (boardId: string) => {
    const data = await BoardAPI.getBoardInfo(boardId);
    if (!data.success) {
      alert("해당 게시판이 존재하지 않습니다.");
      return false;
    }
    return true;
  };

  return {
    getBoardList,
    createBoard,
    addBookmarkBoard,
    deleteBookmarkBoard,
    deleteBoard,
    isExistBoard,
    updateBoard,
  };
}

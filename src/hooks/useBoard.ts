import BoardAPI from "../lib/api/BoardAPI";
import UploadAPI from "../lib/api/UploadAPI";
import UserAPI from "../lib/api/UserAPI";
import { BoardType } from "../types/dataType";

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
    if (body.bgimg) {
      body.bgimg = await UploadAPI.imageUpload(body.formData as object);
    }
    const data = await BoardAPI.createBoard(body);
    return data;
  };

  const updateBoard = async (boardId: string, body: CreateBodyType) => {
    if (body.bgimg) {
      body.bgimg = await UploadAPI.imageUpload(body.formData as object);
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

  const scrollRendering = (
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    isBoardListEnd: boolean,
    setIsBoardListEnd: React.Dispatch<React.SetStateAction<boolean>>,
    skip: number,
    setBoardList: React.Dispatch<React.SetStateAction<BoardType[]>>
  ) => {
    const callback = async (
      [entry]: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      if (entry.isIntersecting && !isLoading && !isBoardListEnd) {
        observer.unobserve(entry.target);
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 400));
        skip += 8;
        getBoardList({ access: "public", skip }).then((res) => {
          if (res && res.length < 8) {
            setIsBoardListEnd(true);
          }
          if (res && res.length > 0) {
            setBoardList((prev) => [...prev, ...res]);
          }
          setIsLoading(false);
        });
        observer.observe(entry.target);
      }
    };
    return callback;
  };

  return {
    getBoardList,
    createBoard,
    addBookmarkBoard,
    deleteBookmarkBoard,
    deleteBoard,
    isExistBoard,
    updateBoard,
    scrollRendering,
  };
}

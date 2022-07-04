import { axiosInstance } from ".";

type CreateBodyType = {
  master: string;
  title: string;
  description?: string;
  access: string;
  secretNumber?: string;
  formData?: object;
  bgimg?: string;
};

const BoardAPI = {
  getBoardList: async (body: { access: string; skip: number }) => {
    const response = await axiosInstance.get("/board/list", {
      params: {
        access: body.access,
        skip: body.skip,
      },
    });
    const data = await response.data;
    return data;
  },

  searchBoard: async (body: { access: string; title: string }) => {
    const response = await axiosInstance.get("/board/search", {
      params: {
        access: body.access,
        title: body.title,
      },
    });
    const data = await response.data.board;
    return data;
  },

  getBoardInfo: async (boardId: string) => {
    const response = await axiosInstance.get(`/board/${boardId}`);
    const data = await response.data;
    return data;
  },

  createBoard: async (body: CreateBodyType) => {
    const response = await axiosInstance.post("/board/create", body);
    const data = await response.data;
    return data;
  },

  updateBoard: async (boardId: string, body: CreateBodyType) => {
    const response = await axiosInstance.post("/board/update", body, {
      params: {
        boardId,
      },
    });
    const data = await response.data;
    return data;
  },

  deleteBoard: async (boardId: string) => {
    const response = await axiosInstance.delete("/board/delete", {
      params: {
        boardId,
      },
    });
    const data = await response.data;
    return data;
  },
};
export default BoardAPI;

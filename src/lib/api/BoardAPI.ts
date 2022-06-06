import Axios from "axios";
import Cookies from "universal-cookie";

type CreateBodyType = {
  master: string;
  title: string;
  description?: string;
  access: string;
  secretNumber?: string;
  formData?: object;
  bgimg?: string;
};

const cookies = new Cookies();

const axiosInstance = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/board`,
});

const BoardAPI = {
  getBoardList: async (body: { access: string; skip: number }) => {
    const response = await axiosInstance.get("/list", {
      params: {
        access: body.access,
        skip: body.skip,
      },
    });
    const data = await response.data;
    return data;
  },

  searchBoard: async (body: { access: string; title: string }) => {
    const response = await axiosInstance.get("/search", {
      params: {
        access: body.access,
        title: body.title,
      },
    });
    const data = await response.data.board;
    return data;
  },

  getBoardInfo: async (boardId: string) => {
    const response = await axiosInstance.get(`/${boardId}`);
    const data = await response.data;
    return data;
  },

  createBoard: async (body: CreateBodyType) => {
    const response = await axiosInstance.post("/create", body, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
    const data = await response.data;
    return data;
  },

  updateBoard: async (boardId: string, body: CreateBodyType) => {
    const response = await axiosInstance.post("/update", body, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        boardId,
      },
    });
    const data = await response.data;
    return data;
  },

  deleteBoard: async (boardId: string) => {
    const response = await axiosInstance.delete("/delete", {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        boardId,
      },
    });
    const data = await response.data;
    return data;
  },
};
export default BoardAPI;

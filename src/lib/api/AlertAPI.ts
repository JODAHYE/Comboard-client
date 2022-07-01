import Axios from "axios";

type AlertBody = {
  postId: string;
  createDate: number;
  description: string;
  subdescription: string;
  detailUrl: string;
};

type ReplyAlertBody = {
  replyUser: string;
  createDate: number;
  description: string;
  subdescription: string;
  detailUrl: string;
};

const axiosInstance = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/alert`,
  withCredentials: true,
});

const ALertAPI = {
  getAlertList: async (skip: number) => {
    const response = await axiosInstance.get("/list", {
      params: {
        skip: skip,
      },
    });
    const data = await response.data.list;
    return data;
  },

  createAlert: async (alertBody: AlertBody) => {
    const response = await axiosInstance.post("/create", alertBody);
    const data = await response.data;
    return data;
  },

  createReplyAlert: async (alertBody: ReplyAlertBody) => {
    const response = await axiosInstance.post("/create_reply", alertBody);
    const data = await response.data;
    return data;
  },

  readAlert: async (alertId: string) => {
    const response = await axiosInstance.patch("/read", { alertId });
    const data = await response.data;
    return data;
  },

  deleteAlert: async () => {
    const response = await axiosInstance.delete("delete");
    const data = await response.data;
    return data;
  },

  getAlertCount: async () => {
    const response = await axiosInstance.get("/count");
    const data = await response.data.count;
    return data;
  },
};
export default ALertAPI;

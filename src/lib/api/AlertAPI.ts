import { axiosInstance } from ".";

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

const ALertAPI = {
  getAlertList: async (skip: number) => {
    const response = await axiosInstance.get("/alert/list", {
      params: {
        skip: skip,
      },
    });
    const data = await response.data.list;
    return data;
  },

  createAlert: async (alertBody: AlertBody) => {
    const response = await axiosInstance.post("/alert/create", alertBody);
    const data = await response.data;
    return data;
  },

  createReplyAlert: async (alertBody: ReplyAlertBody) => {
    const response = await axiosInstance.post("/alert/create_reply", alertBody);
    const data = await response.data;
    return data;
  },

  readAlert: async (alertId: string) => {
    const response = await axiosInstance.patch("/alert/read", { alertId });
    const data = await response.data;
    return data;
  },

  deleteAlert: async () => {
    const response = await axiosInstance.delete("/alert/delete");
    const data = await response.data;
    return data;
  },

  getAlertCount: async () => {
    const response = await axiosInstance.get("/alert/count");
    const data = await response.data.count;
    return data;
  },
};
export default ALertAPI;

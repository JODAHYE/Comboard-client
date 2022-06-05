import Axios from "axios";

type CreateBodyType = {
  master: string;
  title: string;
  description?: string;
  access: string;
  secretNumber?: string;
  formData?: object;
  bgimg?: string;
};

const axiosInstance = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/upload`,
});

const UploadAPI = {
  imageUpload: async (body: CreateBodyType) => {
    const response = await axiosInstance.post("/image", body.formData);
    const imgUrl = await response.data.img_url;
    return imgUrl;
  },
};
export default UploadAPI;

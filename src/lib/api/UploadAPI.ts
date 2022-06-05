import Axios from "axios";

const axiosInstance = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/upload`,
});

const UploadAPI = {
  imageUpload: async (formData: object) => {
    const response = await axiosInstance.post("/image", formData);
    const imgUrl = await response.data.img_url;
    return imgUrl;
  },
  videoUpload: async (formData: object) => {
    const response = await axiosInstance.post("/video", formData);
    const videoUrl = await response.data.video_url;
    return videoUrl;
  },
};
export default UploadAPI;

import { axiosInstance } from ".";

const UploadAPI = {
  imageUpload: async (formData: object) => {
    const response = await axiosInstance.post("/upload/image", formData);
    const imgUrl = await response.data.img_url;
    return imgUrl;
  },
  videoUpload: async (formData: object) => {
    const response = await axiosInstance.post("/upload/video", formData);
    const videoUrl = await response.data.video_url;
    return videoUrl;
  },
};
export default UploadAPI;

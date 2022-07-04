import Axios, { AxiosError } from "axios";

export const axiosInstance = Axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}`,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (config) => {
    try {
      return config;
    } catch (error) {
      console.log(error);
    }
  },
  (error: AxiosError) => {
    if (
      error.response &&
      error.response.status &&
      [400, 500].includes(error.response.status)
    ) {
      alert("잘못된 요청입니다.");
      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

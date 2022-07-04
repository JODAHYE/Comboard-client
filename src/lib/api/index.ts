import axios from "axios";
import { AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Cache: "no-cache",
  },
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

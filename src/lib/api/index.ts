import axios from "axios";
import { AxiosError } from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const axiosInstance = axios.create({
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
      [403].includes(error.response.status)
    ) {
      cookies.remove("user");
      alert("다시 로그인해주세요");
      window.location.replace("/");
    } else if (
      error.response &&
      error.response.status &&
      [500].includes(error.response.status)
    ) {
      alert("잘못된 요청입니다.");
    }

    return Promise.reject(error);
  }
);

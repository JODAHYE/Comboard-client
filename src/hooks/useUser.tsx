import axios from "axios";
import Cookies from "universal-cookie";
export function useUser() {
  const cookies = new Cookies();
  const updateProfileImg = async (imgUrl: string) => {
    const response = await axios.patch(
      `/user/update/image`,
      { imgUrl },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    return response.data.profileImage;
  };
  const updateNickname = async (nickname: string) => {
    const response = await axios.patch(
      `/user/update/nickname`,
      { nickname },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    return response.data.nickname;
  };
  const updatePostLock = async (value: boolean) => {
    const response = await axios.patch(
      `/user/update/post_lock`,
      { value },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
    return response.data.postLock;
  };
  const getUserDetail = async (userId: string) => {
    const response = await axios.get(`/user/detail`, {
      params: { userId },
    });
    const data = await response.data;
    return data;
  };
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}&response_type=code`;

  return {
    updateProfileImg,
    updateNickname,
    updatePostLock,
    getUserDetail,
    kakaoLoginUrl,
  };
}

import UserAPI from "../lib/api/UserAPI";

export function useUser() {
  const updateProfileImg = async (imgUrl: string) => {
    const data = await UserAPI.updateProfileImg(imgUrl);
    return data;
  };

  const updateNickname = async (nickname: string) => {
    const data = await UserAPI.updateNickname(nickname);
    return data;
  };

  const updatePostLock = async (value: boolean) => {
    const data = await UserAPI.updatePostLock(value);
    return data;
  };

  const getUserDetail = async (userId: string) => {
    const data = await UserAPI.getUserDetail(userId);
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

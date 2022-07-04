import { useSelector } from "react-redux";
import { RootState } from "../app/store";

export function useCheck() {
  const { is_auth } = useSelector((state: RootState) => state.user);

  const checkIsLoginReturn = () => {
    if (!is_auth) return;
  };

  const checkIsLoginAlert = () => {
    if (!is_auth) return alert("로그인이 필요합니다.");
  };

  return {
    checkIsLoginAlert,
    checkIsLoginReturn,
  };
}

import styled from "styled-components";
import { BsPlusLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { onPopupClick } from "../../features/menuSlice";
import { useCallback } from "react";
const NewBtn = () => {
  const { is_auth } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const onCreate = useCallback(() => {
    if (!is_auth) return alert("로그인이 필요합니다.");
    dispatch(onPopupClick("create_board"));
  }, [dispatch, is_auth]);

  return <Btn onClick={onCreate} />;
};

export default NewBtn;
const Btn = styled(BsPlusLg)`
  background: ${(props) => props.theme.colors.button};
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 24px;
  color: #fff;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
`;

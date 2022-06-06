import { useCallback } from "react";
import styled from "styled-components";
import { BsPlusLg } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { onPopupClick } from "../../features/menuSlice";

const NewBtn = () => {
  const { is_auth } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const onCreate = useCallback(() => {
    if (!is_auth) return alert("로그인이 필요합니다.");
    dispatch(onPopupClick("create_board"));
  }, [dispatch, is_auth]);

  return (
    <NewButton onClick={onCreate}>
      <Icon />
    </NewButton>
  );
};

export default NewBtn;

const NewButton = styled.button`
  width: 24px;
  height: 24px;
  color: #fff;
  background: ${(props) => props.theme.colors.button};

  border: none;
  outline: none;
  cursor: pointer;

  border-radius: 6px;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
`;

const Icon = styled(BsPlusLg)`
  font-size: 14px;
`;

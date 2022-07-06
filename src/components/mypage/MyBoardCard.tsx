import { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { getCreateList, getCurrentBoard } from "../../features/boardSlice";
import { onPopupClick } from "../../features/menuSlice";
import { useBoard } from "../../hooks/useBoard";
import { BoardType } from "../../types/dataType";

const MyBoardCard = ({ board }: { board: BoardType }) => {
  const dispatch = useDispatch();

  const { deleteBoard } = useBoard();

  const onDelete = useCallback(() => {
    if (window.confirm("게시판을 삭제하시겠습니까?")) {
      deleteBoard(board._id).then((res) => {
        alert("삭제되었습니다.");
        dispatch(getCreateList());
      });
    }
  }, [board, deleteBoard, dispatch]);

  const onUpdate = useCallback(async () => {
    await dispatch(getCurrentBoard(board._id));
    await dispatch(onPopupClick("update_board"));
  }, [board, dispatch]);

  return (
    <Wrap>
      {board.bgimg ? (
        <Img src={board.bgimg} />
      ) : (
        <Img src="image/default-img.jpg" />
      )}
      {board.access === "private" ? (
        <Title>
          <LockIcon src="icon/lock.svg" />
          {board.title}
        </Title>
      ) : (
        <Title>{board.title}</Title>
      )}
      <Control>
        <Button onClick={onUpdate}>수정</Button>
        <Button onClick={onDelete}>삭제</Button>
      </Control>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 30%;
  height: 200px;
  display: flex;
  flex-direction: column;

  overflow: hidden;
  margin: 0 auto;
  margin-bottom: 10px;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  border-radius: 10px;
  cursor: pointer;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 70%;
    margin-bottom: 0px;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 80%;
  object-fit: cover;
`;

const Title = styled.p`
  font-size: 0.9375rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LockIcon = styled.img`
  width: 16px;
`;

const Control = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  font-size: 0.875rem;
  background: #fff;
  padding: 0;
  &:active {
    background: #fff;
  }
`;

export default MyBoardCard;

import { useCallback } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

import { BoardType } from "../../types/dataType";

const BookmarkBoardItem = ({ board }: { board: BoardType }) => {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    if (!board._id) return;
    if (board.secretNumber) {
      let input = window.prompt("암호를 입력하세요.", "");
      if (input !== board.secretNumber) {
        return alert("암호가 일치하지 않습니다.");
      }
    }
    navigate(`/board/${board._id}`);
  }, [board, navigate]);

  return (
    <Wrap onClick={onClick}>
      {board.access === "private" ? (
        <Title>
          <LockIcon src="icon/lock.svg" />
          {board.title}
        </Title>
      ) : (
        <Title>{board.title}</Title>
      )}
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 auto;
  margin-bottom: 10px;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  border-radius: 10px;
  padding: 4px;
  cursor: pointer;
  &:hover {
    border: 1px solid ${(props) => props.theme.colors.buttonActive};
  }
`;

const Title = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LockIcon = styled.img`
  width: 16px;
`;

export default BookmarkBoardItem;

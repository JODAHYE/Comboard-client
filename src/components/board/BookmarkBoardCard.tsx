import { useCallback } from "react";
import { AiFillLock } from "react-icons/ai";
import { useNavigate } from "react-router";
import styled from "styled-components";

import { BoardType } from "../../types/dataType";

const BookmarkBoardCard = ({ board }: { board: BoardType }) => {
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
      {board.bgimg ? (
        <Img src={board.bgimg} />
      ) : (
        <Img src="image/default-img.jpg" />
      )}
      {board.access === "private" ? (
        <Title>
          <LockIcon />
          {board.title}
        </Title>
      ) : (
        <Title>{board.title}</Title>
      )}
    </Wrap>
  );
};

export default BookmarkBoardCard;

const Wrap = styled.div`
  width: 80%;
  height: 160px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 auto;
  margin-bottom: 10px;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    border: 1px solid ${(props) => props.theme.colors.buttonActive};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    height: 100px;
    margin: 4px 0;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 80%;
  object-fit: cover;
`;

const Title = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LockIcon = styled(AiFillLock)`
  font-size: 20px;
`;

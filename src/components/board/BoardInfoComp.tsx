import styled from "styled-components";

import { BoardType } from "../../types/dataType";

const BoardInfoComp = ({ board }: { board: BoardType }) => {
  return (
    <Wrap>
      {board.bgimg && <Img src={board.bgimg} alt="게시판 사진" />}
      <Info>게시글 수: {board.postCount}</Info>
      {board.secretNumber && <Info>암호: {board.secretNumber}</Info>}
      <Info>개설일: {String(board.create_date).substring(0, 8)}</Info>
      <Info>{board.description}</Info>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Img = styled.img`
  max-width: 40%;
  display: inline-block;
`;

const Info = styled.p`
  display: inline-block;
  white-space: pre-wrap;
  font-size: 0.9375rem;
`;

export default BoardInfoComp;

import { useCallback } from "react";
import styled from "styled-components";
import { AiFillLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { BoardType } from "../../types/dataType";

const BoardCard = ({ board }: { board: BoardType }) => {
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
      <Div>
        {board.access === "private" ? (
          <Title>
            <LockIcon />
            {board.title}
          </Title>
        ) : (
          <Title>{board.title}</Title>
        )}

        <Desc>{board.description}</Desc>
        <Row>
          <Desc className="info">게시글 {board.postCount}</Desc>
          {board.lastPostDate &&
            parseInt(moment().format("YYYYMMDD")) - board.lastPostDate < 3 && (
              <Icon src="../../../icon/active.svg" />
            )}
        </Row>
      </Div>
    </Wrap>
  );
};
export default BoardCard;

const Wrap = styled.div`
  width: 24%;
  height: 280px;
  display: flex;
  flex-direction: column;

  background: #fff;
  overflow: hidden;
  margin: 10px;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    border: 1px solid ${(props) => props.theme.colors.buttonActive};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 40%;
    height: 160px;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 50%;
  object-fit: cover;
  @media (min-width: 320px) and (max-width: 480px) {
    min-height: 70%;
    max-height: 70%;
  }
`;

const Div = styled.div`
  width: 100%;
  height: 50%;
  padding: 10px;
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 4px;
  }
`;

const Title = styled.p`
  margin-bottom: 5px;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Desc = styled.p`
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  line-height: 1.2em;
  height: 6em;
  white-space: pre-wrap;
  &.info {
    font-size: 12px;
    display: inline-block;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
`;

const LockIcon = styled(AiFillLock)`
  font-size: 20px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  display: inline-block;
  ${(props) => props.theme.iconColor}
`;

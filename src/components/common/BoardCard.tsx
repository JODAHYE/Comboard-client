import React, { useCallback } from "react";
import styled from "styled-components";
import { AiFillLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { BoardType } from "../../types/dataType";

type PropsType = {
  board: BoardType;
  width?: string;
};
type StyledType = {
  width?: string;
};
const BoardCard: React.FC<PropsType> = ({ board, width }) => {
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
    <Wrap width={width} onClick={onClick}>
      {board.bgimg ? (
        <Img src={board.bgimg} />
      ) : (
        <Img src="image/default-img.jpg" />
      )}
      <Div>
        {board.access === "private" && <LockIcon />}
        <Title>{board.title}</Title>
        <Desc>{board.description}</Desc>
        <Desc className="info">게시글 {board.postCount}</Desc>
        {board.lastPostDate &&
          parseInt(moment().format("YYYYMMDD")) - board.lastPostDate < 3 && (
            <Icon src="../../../icon/active.svg" />
          )}
      </Div>
    </Wrap>
  );
};
export default BoardCard;

const Wrap = styled.div<StyledType>`
  overflow: hidden;
  margin: 10px;
  width: ${(props) => (props.width ? props.width : "48%")};
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  height: 160px;
  display: inline-block;
  position: relative;
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
const Div = styled.div`
  padding: 10px;
  position: absolute;
  width: 60%;
  height: 100%;
  display: inline-block;
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 4px;
  }
`;
const Title = styled.p`
  font-family: "Gothic A1", sans-serif;
  font-weight: 400;
  margin-bottom: 5px;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Desc = styled.p`
  font-size: 14px;
  font-family: "Gothic A1", sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  line-height: 1.2em;
  height: 7.2em;
  white-space: pre-wrap;
  &.info {
    font-size: 12px;
    display: inline-block;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
`;
const Img = styled.img`
  object-fit: cover;
  width: 40%;
  height: 100%;
  display: inline-block;
`;
const LockIcon = styled(AiFillLock)`
  position: absolute;
  right: 3px;
  top: 3px;
  font-size: 20px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  display: inline-block;
  position: absolute;
  right: 0;
  ${(props) => props.theme.iconColor}
`;

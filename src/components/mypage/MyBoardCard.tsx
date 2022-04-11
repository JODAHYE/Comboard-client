import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getCreateList, getCurrentBoard } from "../../features/boardSlice";
import { onPopupClick } from "../../features/menuSlice";
import { useBoard } from "../../hooks/useBoard";
import { BoardType } from "../../types/dataType";

type PropsType = {
  board: BoardType;
};
const MyBoardCard: React.FC<PropsType> = ({ board }) => {
  const { deleteBoard } = useBoard();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const onClick = useCallback(() => {
    navigate(`/board/${board._id}`);
  }, [navigate, board]);
  return (
    <Wrap>
      {board.bgimg ? (
        <Img src={board.bgimg} alt="이미지" onClick={onClick} />
      ) : (
        <Img src="image/default-img.jpg" />
      )}
      <Div>
        <div>
          <Title onClick={onClick}>{board.title}</Title>
          <Control>
            <Btn onClick={onUpdate}>수정</Btn>
            <Btn onClick={onDelete}>삭제</Btn>
          </Control>
        </div>
        <Desc onClick={onClick}>{board.description}</Desc>
        <Info>
          <Date>
            {String(board.create_date).substring(0, 4) +
              "/" +
              String(board.create_date).substring(4, 6) +
              "/" +
              String(board.create_date).substring(6, 8)}
          </Date>
          <SecretCode>
            {board.access === "private" && (
              <Icon src="../../../icon/lock.svg" />
            )}
            {board.secretNumber && board.secretNumber}
          </SecretCode>
          <Date>글 {board.postCount}</Date>
        </Info>
      </Div>
    </Wrap>
  );
};

export default MyBoardCard;
const Wrap = styled.div`
  width: 46%;
  height: 160px;
  ${(props) => props.theme.displayFlex};
  border: 1px solid ${(props) => props.theme.colors.shadow};
  @media (min-width: 320px) and (max-width: 480px) {
    width: 95%;
    height: 120px;
  }
`;
const Img = styled.img`
  object-fit: cover;
  width: 20%;
  height: 100%;
  display: inline-block;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 40%;
  }
`;
const Div = styled.div`
  ${(props) => props.theme.displayFlex};
  flex-direction: column;
  width: 80%;
  height: 100%;
  align-items: start;
  justify-content: start;
  padding: 6px;
  gap: 4px;
  & > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 60%;
    padding: 3px;
  }
`;
const Title = styled.p`
  font-weight: 600;
  width: 87%;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 70%;
  }
`;
const Control = styled.div`
  display: flex;
  justify-content: space-between;
  width: 12%;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 30%;
  }
`;
const Btn = styled.button`
  border: none;
  outline: none;
  font-size: 14px;
  cursor: pointer;
  background: #fff;
  &:active {
    color: ${(props) => props.theme.colors.buttonActive};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
  }
`;
const Desc = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  line-height: 1.2em;
  height: 6em;
  white-space: pre-wrap;
  width: 100%;
  @media (min-width: 320px) and (max-width: 480px) {
    -webkit-line-clamp: 5;
    line-height: 1.2em;
    height: 6em;
  }
`;
const Info = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
const Date = styled.p`
  font-size: 14px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
  }
`;
const SecretCode = styled.p`
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 45%;
  text-align: center;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
    width: 33%;
  }
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  ${(props) => props.theme.iconColor};
  @media (min-width: 320px) and (max-width: 480px) {
    width: 12px;
    height: 12px;
  }
`;

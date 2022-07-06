import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { RootState } from "../../app/store";
import { getCreateList } from "../../features/boardSlice";
import MyBoardUpdate from "./MyBoardUpdate";
import { BoardType } from "../../types/dataType";
import MyBoardCard from "./MyBoardCard";

const MyBoardComp = () => {
  const dispatch = useDispatch();

  const { createList } = useSelector((state: RootState) => state.board);
  const { onPopup } = useSelector((state: RootState) => state.menu);

  const [boardList, setBoardList] = useState<BoardType[]>([]);
  const [skip, setSkip] = useState(0);

  const limit = 6;

  useEffect(() => {
    dispatch(getCreateList());
  }, []);

  useEffect(() => {
    if (createList) {
      let arr = [];
      for (let i = skip; i <= createList.length - 1; i++) {
        if (arr.length === limit) return setBoardList(arr);
        if (createList[i] === createList[createList.length - 1]) {
          arr.push(createList[i]);
          return setBoardList(arr);
        }
        arr.push(createList[i]);
      }
    }
    if (!createList || createList.length === 0) {
      setBoardList([]);
    }
  }, [createList, skip]);

  const onPrev = useCallback(() => {
    if (skip === 0) return;
    setSkip((prev) => prev - limit);
  }, [skip]);

  const onNext = useCallback(() => {
    if (boardList[boardList.length - 1] === createList[createList.length - 1])
      return;
    setSkip((prev) => prev + limit);
  }, [boardList, createList]);

  return (
    <>
      <Title>게시판 관리</Title>
      <List>
        {boardList &&
          boardList.length > 0 &&
          boardList.map((board, i) => (
            <MyBoardCard key={board._id} board={board} />
          ))}
      </List>
      <Control>
        <Button onClick={onPrev}>
          <Icon src="icon/arrow-left.svg" alt="이전" />
        </Button>
        <Button onClick={onNext}>
          <Icon src="icon/arrow-right.svg" alt="다음" />
        </Button>
      </Control>
      {onPopup === "update_board" && <MyBoardUpdate />}
    </>
  );
};

const Title = styled.h1`
  font-family: SpoqaHanSansNeoBold;
  font-size: 20px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 16px;
  }
`;

const List = styled.div`
  width: 50%;
  margin: 0 auto;
  ${(props) => props.theme.displayFlex};
  justify-content: start;
  align-items: start;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
  margin-bottom: 30px;
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;
const Control = styled.div`
  ${(props) => props.theme.displayFlex};
`;

const Button = styled.button`
  all: unset;
  cursor: pointer;
  width: 30px;
`;

const Icon = styled.img``;

export default MyBoardComp;

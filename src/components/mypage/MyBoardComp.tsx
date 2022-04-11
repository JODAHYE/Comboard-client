import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { getCreateList } from "../../features/boardSlice";
import MyBoardCard from "./MyBoardCard";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import MyBoardUpdate from "./MyBoardUpdate";
import { BoardType } from "../../types/dataType";

const MyBoardComp = () => {
  const dispatch = useDispatch();
  const { createList } = useSelector((state: RootState) => state.board);
  const [boardList, setBoardList] = useState<BoardType[]>([]);
  const [skip, setSkip] = useState(0);
  const { onPopup } = useSelector((state: RootState) => state.menu);
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
    if(!createList || createList.length===0){
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
          boardList.map((v, i) => (
            <MyBoardCard
              key={i}
              board={v}
              // setUpdateCLickBoard={setUpdateCLickBoard}
            />
          ))}
      </List>
      <div>
        <PrevBtn onClick={onPrev} />
        <NextBtn onClick={onNext} />
      </div>
      {onPopup === "update_board" && <MyBoardUpdate />}
    </>
  );
};

export default MyBoardComp;
const Title = styled.h1`
  font-family: SpoqaHanSansNeoBold;
  font-size: 20px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 16px;
  }
`;
const List = styled.div`
  ${(props) => props.theme.displayFlex};
  justify-content: start;
  align-items: start;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  margin-top: 30px;
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;
const PrevBtn = styled(GrFormPrevious)`
  cursor: pointer;
  font-size: 26px;
`;
const NextBtn = styled(GrFormNext)`
  cursor: pointer;
  font-size: 26px;
`;
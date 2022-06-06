import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { getCreateList } from "../../features/boardSlice";
import { myMenuClick } from "../../features/menuSlice";
import { getAlertCount, getBookmarkList } from "../../features/userSlice";
import { useMenu } from "../../hooks/useMenu";
import { BoardType } from "../../types/dataType";
import BoardCard from "../common/BoardCard";
import SearchForm from "../common/SearchForm";

type activeType = {
  active: boolean;
};

const MyBoard: React.FC = () => {
  const dispatch = useDispatch();

  const { myMenu } = useSelector((state: RootState) => state.menu);
  const { bookmarkBoardList } = useSelector((state: RootState) => state.user);
  const { createList } = useSelector((state: RootState) => state.board);

  const [searchVal, setSearchVal] = useState("");
  const [filterList, setFilterList] = useState<BoardType[]>([]);

  useEffect(() => {
    dispatch(getCreateList());
    dispatch(getBookmarkList());
    dispatch(getAlertCount());
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
      const target = e.target as HTMLElement;
      dispatch(myMenuClick(target.innerHTML));
      setFilterList([]);
      setSearchVal("");
    },
    [dispatch]
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!searchVal) return;
      if (searchVal.length < 2) {
        return alert("두 글자 이상 입력하세요");
      }
      let arr = [];
      if (myMenu === "개설한 게시판") {
        arr = createList.filter((v, i) => v.title.indexOf(searchVal) > -1);
      } else {
        arr = bookmarkBoardList.filter(
          (v, i) => v.title.indexOf(searchVal) > -1
        );
      }
      if (arr.length === 0) {
        return alert("검색 결과가 없습니다.");
      }
      return setFilterList(arr);
    },
    [bookmarkBoardList, myMenu, searchVal, createList]
  );

  const onChangeSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) {
        setFilterList([]);
      }
      setSearchVal(e.target.value);
    },
    []
  );

  return (
    <Wrap>
      <Menu>
        <MenuItem onClick={onClick} active={useMenu(myMenu, "개설한 게시판")}>
          개설한 게시판
        </MenuItem>
        <MenuItem onClick={onClick} active={useMenu(myMenu, "즐겨찾기")}>
          즐겨찾기
        </MenuItem>
      </Menu>
      <List>
        <SearchForm
          onChangeSearchInput={onChangeSearchInput}
          onSubmit={onSubmit}
          val={searchVal}
        />
        {myMenu === "개설한 게시판" &&
          !searchVal &&
          createList.map((item, i) => {
            return <BoardCard key={i} board={item} width={"98%"} />;
          })}
        {myMenu === "개설한 게시판" &&
          searchVal &&
          filterList.map((item, i) => {
            return <BoardCard key={i} width={"98%"} board={item} />;
          })}

        {myMenu === "즐겨찾기" &&
          !searchVal &&
          bookmarkBoardList.map((item, i) => {
            return <BoardCard key={i} board={item} width={"98%"} />;
          })}
        {myMenu === "즐겨찾기" &&
          searchVal &&
          filterList.map((item, i) => {
            return <BoardCard key={i} width={"98%"} board={item} />;
          })}
      </List>
    </Wrap>
  );
};
export default MyBoard;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

const Menu = styled.div`
  ${(props) => props.theme.displayFlex};
  justify-content: space-around;
  padding: 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
`;

const MenuItem = styled.p<activeType>`
  font-weight: 600;
  font-family: BMHANNAAir;
  font-size: 18px;
  color: ${(props) => (props.active ? "#000" : props.theme.colors.fontColor)};
  cursor: pointer;
`;

const List = styled.div`
  height: 94%;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

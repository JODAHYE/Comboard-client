import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import BoardCard from "./BoardCard";
import NewBtn from "./NewBtn";
import CreateBoard from "./CreateBoardPopup";
import Loading from "../common/Loading";
import SearchForm from "../common/SearchForm";
import { useBoard } from "../../hooks/useBoard";
import { BoardType } from "../../types/dataType";

const PrivateBoard = () => {
  const { getBoardList } = useBoard();

  const { onPopup } = useSelector((state: RootState) => state.menu);

  const [loading, setLoading] = useState(false);
  const [boardList, setBoardList] = useState<BoardType[]>([]);
  const [searchVal, setSearchVal] = useState("");
  const [filterList, setFilterList] = useState<BoardType[]>([]);

  useEffect(() => {
    setLoading(true);
    getBoardList({ access: "private", skip: 0 }).then((res) => {
      setBoardList(res);
      setLoading(false);
    });
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!searchVal) return;
      if (searchVal.length < 2) {
        return alert("두 글자 이상 입력하세요");
      }
      const arr = boardList.filter((v, i) => {
        return v.title.indexOf(searchVal) > -1;
      });
      if (arr.length === 0) {
        alert("검색 결과가 없습니다.");
      }
      setFilterList(arr);
    },
    [searchVal, boardList]
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
      <Header>
        <SearchForm
          onSubmit={onSubmit}
          onChangeSearchInput={onChangeSearchInput}
          val={searchVal}
        />
        <NewBtn />
      </Header>
      {loading && <Loading />}
      {!loading &&
        filterList.length > 0 &&
        filterList.map((item, i) => {
          return <BoardCard key={item._id} board={item} />;
        })}
      {!loading && filterList.length === 0 && (
        <P>찾을 비밀 게시판 이름을 검색해주세요.</P>
      )}
      {onPopup === "create_board" && <CreateBoard />}
    </Wrap>
  );
};

export default PrivateBoard;

const Wrap = styled.div`
  width: 70%;
  height: 100%;

  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
  }
`;

const Header = styled.div`
  ${(props) => props.theme.displayFlex};
  width: 100%;
  margin: 6px;
`;

const P = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.buttonActive};
  margin: 30px 0;
  @media (min-width: 320px) and (max-width: 480px) {
    margin: 0px;
  }
`;

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import BoardCard from "../common/BoardCard";
import NewBtn from "../common/NewBtn";
import CreateBoard from "../board/CreateBoard";
import Loading from "../common/Loading";
import SearchForm from "../common/SearchForm";
import { useBoard } from "../../hooks/useBoard";
import { BoardType } from "../../types/dataType";

const PrivateBoard: React.FC = () => {
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
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setFilterList([]);
    }
    setSearchVal(e.target.value);
  }, []);
  return (
    <Wrap>
      <NewBtn />
      <SearchForm onSubmit={onSubmit} onChange={onChange} val={searchVal} />
      {loading && <Loading />}
      {!loading &&
        filterList.length > 0 &&
        filterList.map((v, i) => {
          return <BoardCard key={i} board={v} />;
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
  position: relative;
  padding: 40px;
  width: 70%;
  height: 100%;
  border-right: 1px solid ${(props) => props.theme.colors.shadow};
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    padding: 40px 10px;
  }
`;

const P = styled.p`
  color: ${(props) => props.theme.colors.buttonActive};
  margin: 30px 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (min-width: 320px) and (max-width: 480px) {
    margin: 0px;
  }
`;

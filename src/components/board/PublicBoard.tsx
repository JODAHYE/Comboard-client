import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { useBoard } from "../../hooks/useBoard";
import { BoardType } from "../../types/dataType";
import BoardCard from "./BoardCard";
import Loading from "../common/Loading";
import NewBtn from "./NewBtn";
import SearchForm from "../common/SearchForm";
import CreateBoard from "./CreateBoardPopup";

const PublicBoard: React.FC = () => {
  const { getBoardList, scrollRendering, searchBoard } = useBoard();

  const target = useRef<HTMLDivElement>(null);

  const { onPopup } = useSelector((state: RootState) => state.menu);

  const [boardList, setBoardList] = useState<BoardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBoardListEnd, setIsBoardListEnd] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchBoardData, setSearchBoardData] = useState<BoardType | null>();

  let skip = 0;

  useEffect(() => {
    setIsLoading(true);
    getBoardList({ access: "public", skip }).then((res) => {
      setBoardList(res);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!target.current) return;
    const observer = new IntersectionObserver(
      scrollRendering(
        isLoading,
        setIsLoading,
        isBoardListEnd,
        setIsBoardListEnd,
        skip,
        setBoardList
      ),
      {
        threshold: 0.6,
      }
    );
    observer.observe(target.current);
    return () => {
      observer && observer.disconnect();
      setIsLoading(false);
    };
  }, [target]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!searchVal) return;
      if (searchVal.length < 2) {
        return alert("두 글자 이상 입력하세요");
      }
      searchBoard({ access: "public", title: searchVal }).then((res) => {
        setSearchBoardData(res);
      });
    },
    [searchVal, boardList, searchBoard]
  );

  const onChangeSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchVal(e.target.value);
      if (!e.target.value) {
        return setSearchBoardData(null);
      }
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
      <List>
        {searchBoardData && <BoardCard board={searchBoardData} />}
        {!searchBoardData &&
          boardList &&
          boardList.length > 0 &&
          boardList.map((board, i) => {
            return <BoardCard key={board._id} board={board} />;
          })}
        {!searchBoardData && !isBoardListEnd && (
          <Target ref={target}>
            <Loading />
          </Target>
        )}
      </List>
      {onPopup === "create_board" && <CreateBoard />}
    </Wrap>
  );
};

export default PublicBoard;

const Wrap = styled.div`
  width: 70%;
  height: 100%;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
  }
`;

const Header = styled.div`
  ${(props) => props.theme.displayFlex};
  width: 100%;
  margin: 6px;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  height: 94%;
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Target = styled.div`
  width: 100%;
  height: 300px;
  @media (min-width: 320px) and (max-width: 480px) {
    height: 150px;
  }
`;

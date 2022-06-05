import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { useBoard } from "../../hooks/useBoard";
import { BoardType } from "../../types/dataType";
import BoardCard from "../common/BoardCard";
import Loading from "../common/Loading";
import NewBtn from "../common/NewBtn";
import CreateBoard from "./CreateBoard";

const PublicBoard: React.FC = () => {
  const { getBoardList } = useBoard();

  const target = useRef<HTMLDivElement>(null);

  const { onPopup } = useSelector((state: RootState) => state.menu);

  const [boardList, setBoardList] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [boardListEnd, setBoardListEnd] = useState(false);

  let skip = 0;

  useEffect(() => {
    setLoading(true);
    getBoardList({ access: "public", skip }).then((res) => {
      setBoardList(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!target.current) return;
    const observer = new IntersectionObserver(callback, {
      threshold: 0.6,
    });
    observer.observe(target.current);
    return () => {
      observer && observer.disconnect();
      setLoading(false);
    };
  }, [target]);

  const callback = async (
    [entry]: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    if (entry.isIntersecting && !loading && !boardListEnd) {
      observer.unobserve(entry.target);
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      skip += 8;
      getBoardList({ access: "public", skip }).then((res) => {
        if (res && res.length < 8) {
          setBoardListEnd(true);
        }
        if (res && res.length > 0) {
          setBoardList((prev) => prev.concat(res));
        }
        setLoading(false);
      });
      observer.observe(entry.target);
    }
  };

  return (
    <Wrap>
      <NewBtn />
      <List>
        {boardList &&
          boardList.length > 0 &&
          boardList.map((board, i) => {
            return <BoardCard key={i} board={board} />;
          })}
        {!boardListEnd && (
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
  position: relative;
  padding: 40px;
  border-right: 1px solid ${(props) => props.theme.colors.shadow};
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    padding: 40px 10px;
  }
`;

const List = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    margin: 0 auto;
  }
`;

const Target = styled.div`
  width: 100%;
  height: 300px;
  @media (min-width: 320px) and (max-width: 480px) {
    height: 150px;
  }
`;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { usePost } from "../../hooks/usePost";
import PostListItem from "./PostListItem";
import { PostType } from "../../types/dataType";
import Loading from "../common/Loading";

type PropsType = {
  sort: string;
};
const PostList: React.FC<PropsType> = ({ sort }) => {
  const { getPostList } = usePost();
  const { currentBoard } = useSelector((state: RootState) => state.board);
  const [postCount, setPostCount] = useState(0);
  const [postList, setPostList] = useState<PostType[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageArr, setPageArr] = useState<Number[]>([]); //페이지 배열 [6, 7, 8, 9, 10]
  const viewPostCount = 22; //보일 게시글 개수
  const pageCount = 3; //◀ 1 2 3 4 5▶  페이지 번호 개수
  const [page, setPage] = useState(0); //총 페이지 수  (ex: 100쪽)(끝페이지:?)
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (currentBoard._id) {
      setLoading(true);
      getPostList(currentBoard._id, 0, sort).then((res) => {
        setPostList(res);
        setPostCount(currentBoard.postCount);
        setLoading(false);
      });
    }
  }, [currentBoard._id, sort]);

  useEffect(() => {
    if (postCount > -1) {
      setPage(Math.ceil(postCount / viewPostCount));
    }
  }, [postCount]);

  useEffect(() => {
    if (pageArr) {
      setPageArr([]);
    }
    if (page > 0) {
      for (let i = 1; i <= page; i++) {
        setPageArr((prev) => prev.concat([i]));
        if (i >= pageCount) return;
      }
    }
  }, [page]);

  useEffect(() => {
    if (!currentBoard._id) return;
    setLoading(true);
    getPostList(currentBoard._id, viewPostCount * (currentPage - 1), sort).then(
      (res) => {
        setPostList(res);
        setLoading(false);
      }
    );
  }, [currentPage]);

  const onCurrentPage = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    const target = e.target as HTMLParagraphElement;
    setCurrentPage(parseInt(target.innerHTML));
  };

  const onPrev = () => {
    if (pageArr[0] === 1) return;
    const arr = [];
    const arrEnd = pageArr[pageArr.length - 1] as number;
    let i = arrEnd - pageArr.length;
    while (arr.length < pageCount) {
      arr.push(i);
      i--;
    }
    setPageArr(arr.reverse());
  };

  const onNext = () => {
    const arrEnd = pageArr[pageArr.length - 1] as number;
    if (arrEnd >= page) return;
    const arr = [];

    for (let i = arrEnd + 1; i <= page; i++) {
      if (arr.length < pageCount) arr.push(i);
    }
    setPageArr(arr);
  };

  return (
    <>
    {loading && <Loading />}
      <Wrap>
        {postList &&
          postList.length > 0 &&
          postList.map((v, i) => {
            return <PostListItem key={i} post={v} />;
          })}
        <PageNation>
          <PageNum onClick={onPrev}>
            <IoIosArrowBack />
          </PageNum>
          {pageArr.map((num, i) => (
            <PageNum key={i} onClick={onCurrentPage}>
              {num}
            </PageNum>
          ))}

          <PageNum onClick={onNext}>
            <IoIosArrowForward />
          </PageNum>
        </PageNation>
      </Wrap>
    </>
  );
};

export default PostList;
const Wrap = styled.div`
  width: 100%;
`;
const PageNation = styled.div`
  width: 100%;
  margin: 30px 0;
  ${(props) => props.theme.displayFlex}
  @media (min-width: 320px) and (max-width: 480px) {
    margin: 10px 0;
    height: auto;
    /* border: 1px solid red; */
  }
`;
const PageNum = styled.p`
  margin: 6px;
  cursor: pointer;
`;

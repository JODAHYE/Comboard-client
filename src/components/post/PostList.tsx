import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { RootState } from "../../app/store";
import { usePost } from "../../hooks/usePost";
import PostListItem from "./PostListItem";
import { PostType } from "../../types/dataType";
import Loading from "../common/Loading";

const PostList = ({ sort }: { sort: string }) => {
  const { getPostList } = usePost();

  const { currentBoard } = useSelector((state: RootState) => state.board);

  const [postCount, setPostCount] = useState(0);
  const [postList, setPostList] = useState<PostType[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageArr, setPageArr] = useState<Number[]>([]); //페이지 배열 [6, 7, 8, 9, 10]
  const [page, setPage] = useState(0); //총 페이지 수  (ex: 100쪽)(끝페이지:?)
  const [loading, setLoading] = useState(false);

  const viewPostCount = 22; //보일 게시글 개수
  const pageCount = 3; //◀ 1 2 3 4 5▶  페이지 번호 개수

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
    setCurrentPage(parseInt(target.innerText));
  };

  const onPrev = useCallback(() => {
    if (pageArr[0] === 1) return;
    const arr = [];
    const arrEnd = pageArr[pageArr.length - 1] as number;
    let i = arrEnd - pageArr.length;
    while (arr.length < pageCount) {
      arr.push(i);
      i--;
    }
    setPageArr(arr.reverse());
  }, [pageArr]);

  const onNext = useCallback(() => {
    const arrEnd = pageArr[pageArr.length - 1] as number;
    if (arrEnd >= page) return;
    const arr = [];
    for (let i = arrEnd + 1; i <= page; i++) {
      if (arr.length < pageCount) arr.push(i);
    }
    setPageArr(arr);
  }, [page, pageArr]);

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <Wrap>
          {postList &&
            postList.length > 0 &&
            postList.map((post, i) => {
              return <PostListItem key={post._id} post={post} />;
            })}
          <PageNation>
            <Button onClick={onPrev}>
              <Icon src="../../../icon/arrow-left.svg" alt="이전" />
            </Button>
            {pageArr.map((num, i) => (
              <PageNum key={i} onClick={onCurrentPage}>
                {num}
              </PageNum>
            ))}
            <Button onClick={onNext}>
              <Icon src="../../../icon/arrow-right.svg" alt="다음" />
            </Button>
          </PageNation>
        </Wrap>
      )}
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
    height: auto;
    margin: 10px 0;
  }
`;

const PageNum = styled.p`
  margin: 0 6px;
  cursor: pointer;
`;

const Button = styled.button`
  all: unset;
  cursor: pointer;
  width: 20px;
  padding: 4px;
`;

const Icon = styled.img``;

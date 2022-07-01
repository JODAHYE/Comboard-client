import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { usePost } from "../../hooks/usePost";
import MyPostListItem from "./MyPostListItem";
import Loading from "../common/Loading";
import { PostType } from "../../types/dataType";
import ContentWrap from "./ContentWrap";
import ControlButtons from "./ControlButtons";

type StyleType = {
  width: string;
};

const MyPostList = () => {
  const { getMyPostList, getMyPostCount, deleteMyPost } = usePost();

  const [skip, setSkip] = useState(0);
  const [postList, setPostList] = useState<PostType[]>();
  const [postCount, setPostCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkList, setCheckList] = useState<string[]>();

  const limit = 18;

  useEffect(() => {
    setLoading(true);
    getMyPostList(skip).then((res) => {
      setPostList(res);
      setLoading(false);
    });
    if (skip === 0) {
      getMyPostCount().then((res) => {
        setPostCount(res);
      });
    }
  }, [skip]);

  const onPrev = useCallback(() => {
    if (skip === 0) return;
    setSkip((prev) => prev - limit);
    setCurrentPage((prev) => prev - 1);
  }, [skip]);

  const onNext = useCallback(() => {
    if (currentPage * limit >= postCount) return;
    setSkip((prev) => prev + limit);
    setCurrentPage((prev) => prev + 1);
  }, [skip, postCount, currentPage]);

  const onDelete = useCallback(() => {
    if (!checkList || checkList.length === 0) return;
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMyPost(checkList).then(() => {
        alert("삭제되었습니다.");
        setLoading(true);
        getMyPostCount().then((res) => {
          setPostCount(res);
        });
        getMyPostList(skip).then((res) => {
          setPostList(res);
          setLoading(false);
        });
      });
    }
  }, [checkList, deleteMyPost, getMyPostCount, skip, getMyPostList]);

  return (
    <>
      <Title>
        {`내 게시글
        (${postCount})`}
      </Title>
      {!loading && (!postList || postList.length === 0) && (
        <NoPost>작성한 게시글이 없습니다.</NoPost>
      )}
      {!loading && postList && postList.length > 0 && (
        <ContentWrap>
          <InfoBox>
            <Info width="70%">제목</Info>
            <Info width="6%">작성일</Info>
            <Info width="6%">추천</Info>
            <Info width="6%">조회</Info>
          </InfoBox>
          {postList.map((post, i) => (
            <MyPostListItem
              key={post._id}
              post={post}
              setCheckList={setCheckList}
              checkList={checkList}
            />
          ))}
          <ControlButtons
            onPrev={onPrev}
            onNext={onNext}
            onDelete={onDelete}
            text={"선택삭제"}
          />
        </ContentWrap>
      )}
      {loading && <Loading />}
    </>
  );
};

export default MyPostList;

const Title = styled.h1`
  font-family: SpoqaHanSansNeoBold;
  font-size: 20px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 16px;
  }
`;

const InfoBox = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.colors.button};
  padding: 6px 0;
`;

const Info = styled.p<StyleType>`
  width: ${(props) => props.width};
  text-align: center;
  @media (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
`;

const NoPost = styled.p`
  margin-top: 100px;
`;

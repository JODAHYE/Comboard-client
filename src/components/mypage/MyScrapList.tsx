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

const MyScrapList = () => {
  const { clearScrap, getScrapList } = usePost();

  const [skip, setSkip] = useState(0);
  const [postList, setPostList] = useState<PostType[]>();
  const [loading, setLoading] = useState(false);
  const [checkList, setCheckList] = useState<string[]>();

  const limit = 18;

  useEffect(() => {
    setLoading(true);
    getScrapList(skip).then((res) => {
      if (skip > 0 && res.length === 0) {
        alert("게시글이 없습니다.");
        setSkip((prev) => prev - limit);
      }
      setPostList(res);
      setLoading(false);
    });
  }, [skip]);

  const onPrev = useCallback(() => {
    if (skip === 0) return;
    setSkip((prev) => prev - limit);
  }, [skip]);

  const onNext = useCallback(() => {
    setSkip((prev) => prev + limit);
  }, []);

  const onDelete = useCallback(() => {
    if (!checkList || checkList.length === 0) return;
    clearScrap(checkList).then(() => {
      alert("스크랩 해제되었습니다.");
      setLoading(true);
      getScrapList(skip).then((res) => {
        if (res.length === 0) {
          alert("게시글이 없습니다.");
          setSkip((prev) => prev - limit);
        }
        setPostList(res);
        setLoading(false);
      });
    });
  }, [checkList, getScrapList, clearScrap, skip]);

  return (
    <>
      <Title>스크랩</Title>
      {!loading && (!postList || postList.length === 0) && (
        <NoPost>스크랩한 게시글이 없습니다.</NoPost>
      )}
      {loading && <Loading />}
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
            text={"스크랩 해제"}
          />
        </ContentWrap>
      )}
    </>
  );
};

export default MyScrapList;

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
  text-align: center;
  margin-top: 100px;
`;

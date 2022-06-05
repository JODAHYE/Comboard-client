import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { usePost } from "../../hooks/usePost";
import MyPostListItem from "./MyPostListItem";
import Loading from "../common/Loading";
import { PostType } from "../../types/dataType";

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
        <List>
          <InfoBox>
            <Info width="70%">제목</Info>
            <Info width="6%">작성일</Info>
            <Info width="6%">추천</Info>
            <Info width="6%">조회</Info>
          </InfoBox>
          {postList.map((post, i) => (
            <MyPostListItem
              key={i}
              post={post}
              setCheckList={setCheckList}
              checkList={checkList}
            />
          ))}
          <Control>
            <div>
              <PrevBtn onClick={onPrev} />
              <NextBtn onClick={onNext} />
            </div>
            <DeleteBtn onClick={onDelete}>선택 삭제</DeleteBtn>
          </Control>
        </List>
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

const List = styled.div`
  width: 60%;
  margin-top: 30px;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    flex-direction: column;
  }
`;

const PrevBtn = styled(GrFormPrevious)`
  cursor: pointer;
  font-size: 26px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 22px;
  }
`;

const NextBtn = styled(GrFormNext)`
  cursor: pointer;
  font-size: 26px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 22px;
  }
`;

const DeleteBtn = styled.button`
  color: #fff;
  background: ${(props) => props.theme.colors.button};
  border-radius: 5px;
  padding: 4px;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
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

const Control = styled.div`
  ${(props) => props.theme.displayFlex}
  margin: 0 auto;
`;

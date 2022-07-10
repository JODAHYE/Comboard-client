import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { useComment } from "../../hooks/useComment";
import MyCommentListItem from "./MyCommentListItem";
import Loading from "../common/Loading";
import { PostType } from "../../types/dataType";
import ContentWrap from "./ContentWrap";
import ControlButtons from "./ControlButtons";

type CommentType = {
  _id: string;
  writer: string;
  post: PostType;
  writer_name: string;
  content: string;
  create_date: number;
  childComment: string[];
};

const MyCommentComp = () => {
  const { getMyCommentList, getMyCommentCount, deleteMyComment } = useComment();

  const [commentList, setCommentList] = useState<CommentType[]>();
  const [skip, setSkip] = useState(0);
  const [checkList, setCheckList] = useState<string[]>();
  const [commentCount, setCommentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 16;

  useEffect(() => {
    setLoading(true);
    getMyCommentList(skip).then((res) => {
      setCommentList(res);
      setLoading(false);
    });
    if (skip === 0) {
      getMyCommentCount().then((res) => {
        setCommentCount(res);
      });
    }
  }, [skip]);

  useEffect(() => {
    if (!checkList) setCheckList([]);
  }, [checkList]);

  const onPrev = useCallback(() => {
    if (skip === 0) return;
    setSkip((prev) => prev - limit);
    setCurrentPage((prev) => prev - 1);
  }, [skip]);

  const onNext = useCallback(() => {
    if (currentPage * limit >= commentCount) return;
    setSkip((prev) => prev + limit);
    setCurrentPage((prev) => prev + 1);
  }, [commentCount, currentPage]);

  const onDelete = useCallback(() => {
    if (!checkList || checkList.length === 0) return;
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMyComment(checkList).then(() => {
        alert("삭제되었습니다.");
        setLoading(true);
        getMyCommentCount().then((res) => {
          setCommentCount(res);
        });
        getMyCommentList(skip).then((res) => {
          setCommentList(res);
          setLoading(false);
        });
      });
    }
  }, [checkList, deleteMyComment, getMyCommentCount, getMyCommentList, skip]);

  return (
    <>
      <Title>
        {`내 댓글
        (${commentCount})`}
      </Title>
      {!loading && (!commentList || commentList.length === 0) && (
        <NoPost>작성한 댓글이 없습니다.</NoPost>
      )}
      {loading && <Loading />}
      {!loading && commentList && commentList.length > 0 && (
        <ContentWrap>
          {commentList.map((comment, i) => (
            <MyCommentListItem
              key={comment._id}
              comment={comment}
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
    </>
  );
};

const Title = styled.h1`
  font-family: SpoqaHanSansNeoBold;
  font-size: 1.25rem;

  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 1rem;
  }
`;

const NoPost = styled.p`
  margin-top: 100px;
`;

export default MyCommentComp;

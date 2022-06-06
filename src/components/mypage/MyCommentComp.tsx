import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { useComment } from "../../hooks/useComment";
import MyCommentListItem from "./MyCommentListItem";
import Loading from "../common/Loading";
import { PostType } from "../../types/dataType";
import ContentWrap from "./ContentWrap";

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
      console.log(res);
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
    console.log(skip);
    setSkip((prev) => prev - limit);
    setCurrentPage((prev) => prev - 1);
  }, [skip]);

  const onNext = useCallback(() => {
    if (currentPage * limit >= commentCount) return;
    setSkip((prev) => prev + limit);
    setCurrentPage((prev) => prev + 1);
  }, [commentCount, skip, currentPage]);

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
              key={i}
              comment={comment}
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
        </ContentWrap>
      )}
    </>
  );
};

export default MyCommentComp;

const Title = styled.h1`
  font-family: SpoqaHanSansNeoBold;
  font-size: 20px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 16px;
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

const Control = styled.div`
  margin: 0 auto;
  ${(props) => props.theme.displayFlex}
`;

const DeleteBtn = styled.button`
  color: #fff;
  background: ${(props) => props.theme.colors.button};
  border-radius: 5px;
  padding: 4px;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
`;

const NoPost = styled.p`
  margin-top: 100px;
`;

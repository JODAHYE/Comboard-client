import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";

import { RootState } from "../../app/store";
import { useComment } from "../../hooks/useComment";
import CommentItem from "./CommentItem";
import { CommentType, PostType } from "../../types/dataType";
import Loading from "../common/Loading";
import { getCommentList } from "../../features/commentSlice";

const CommentComp = ({ post }: { post: PostType }) => {
  const dispatch = useDispatch();
  const params = useParams();

  const { createComment } = useComment();

  const { nickname, is_auth } = useSelector((state: RootState) => state.user);
  const { commentList } = useSelector((state: RootState) => state.comment);

  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentValue, setCommentValue] = useState("");

  useEffect(() => {
    if (!params.postId) return;
    if (commentList.length === 0) {
      dispatch(getCommentList(params.postId));
    }
  }, []);

  const onSubmit = useCallback(() => {
    if (!is_auth) return alert("로그인이 필요합니다.");
    if (!commentValue) return;
    setLoading(true);
    const body = {
      post: post._id,
      writer_name: nickname,
      content: commentValue,
      createDate: parseInt(moment().format("YYYYMMDDHHmm")),
    };
    createComment(body).then((res) => {
      setComments((prev) => prev?.concat(res.comment));
      setCommentsCount(res.comments_count + 1);
      setCommentValue("");
      setLoading(false);
    });
  }, [commentValue, createComment, is_auth, nickname, post._id]);

  return (
    <Wrap>
      <FlexDiv>
        <Div>
          <Count>댓글 {commentsCount}</Count>
          <SubmitBtn onClick={onSubmit}>등록</SubmitBtn>
        </Div>
        <TextArea
          value={commentValue}
          onChange={(e) => {
            setCommentValue(e.target.value);
          }}
        />
      </FlexDiv>
      <List>
        {commentList.length > 0 &&
          commentList.map((comment, i) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postWriter={post.writer}
              setCommentsCount={setCommentsCount}
            />
          ))}
        {comments.length > 0 &&
          comments.map((comment, i) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postWriter={post.writer}
              setCommentsCount={setCommentsCount}
            />
          ))}
        {loading && <Loading />}
      </List>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  padding: 20px 0 50px;
  border-top: 2px solid ${(props) => props.theme.colors.shadow};
`;

const FlexDiv = styled.div`
  ${(props) => props.theme.displayFlex};
  justify-content: start;
  gap: 10px;
  font-size: 0.875rem;
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
  }
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 98%;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const TextArea = styled.textarea`
  width: 90%;
  height: 150px;
  display: inline-block;
  outline: none;
  border: none;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  resize: none;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 98%;
    height: 80px;
    flex-direction: column;
  }
`;

const SubmitBtn = styled.button`
  border: 1px solid ${(props) => props.theme.colors.button};
  border-radius: 2px;
  background: #fff;
  color: ${(props) => props.theme.colors.button};
  padding: 6px;
  &:active {
    color: #fff;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
  }
`;

const Count = styled.p`
  margin: 6px 0;
`;

const List = styled.div`
  margin: 20px 0;
  border-top: 1px solid ${(props) => props.theme.colors.shadow};
`;

export default CommentComp;

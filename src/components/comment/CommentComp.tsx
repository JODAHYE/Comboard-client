import { useEffect, useState } from "react";
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

type PropTypes = {
  post: PostType;
};

const CommentComp: React.FC<PropTypes> = ({ post }) => {
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

  const onSubmit = () => {
    if (!is_auth) return alert("로그인이 필요합니다.");
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
      setLoading(false);
    });
  };

  return (
    <Wrap>
      <FlexDiv>
        <Div>
          <P>댓글 {commentsCount}</P>
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
              key={i}
              comment={comment}
              postWriter={post.writer}
              setCommentsCount={setCommentsCount}
            />
          ))}
        {comments.length > 0 &&
          comments.map((comment, i) => (
            <CommentItem
              key={i}
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

export default CommentComp;

const Wrap = styled.div`
  width: 100%;
  padding: 20px 0 50px;
  border-top: 2px solid ${(props) => props.theme.colors.shadow};
`;

const FlexDiv = styled.div`
  ${(props) => props.theme.displayFlex};
  justify-content: start;
  gap: 10px;
  font-size: 14px;
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
    background: ${(props) => props.theme.colors.buttonActive};
    color: #fff;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
    font-size: 12px;
  }
`;

const P = styled.p`
  margin: 6px 0;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
  }
`;

const List = styled.div`
  margin: 20px 0;
  border-top: 1px solid ${(props) => props.theme.colors.shadow};
`;

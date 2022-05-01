import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { RootState } from "../../app/store";
import { useComment } from "../../hooks/useComment";
import moment from "moment";
import CommentItem from "./CommentItem";
import { CommentType, PostType } from "../../types/dataType";
import Loading from "../common/Loading";
import { getCommentList } from "../../features/commentSlice";
import { useParams } from "react-router-dom";
const cookies = new Cookies();

type PropTypes = {
  post: PostType;
};
const CommentComp: React.FC<PropTypes> = ({ post }) => {
  const { commentCreate } = useComment();
  const contentField = useRef<HTMLDivElement>(null);
  const { nickname } = useSelector((state: RootState) => state.user);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [loading, setLoading] = useState(false);
  const { commentList } = useSelector((state: RootState) => state.comment);
  const [comments, setComments] = useState<CommentType[]>([]);
  const dispatch = useDispatch();
  const params = useParams();
  useEffect(() => {
    if (!params.postId) return;
    if (commentList.length === 0) {
      dispatch(getCommentList(params.postId));
    }
  }, []);
  const onSubmit = () => {
    if (!cookies.get("accessToken")) return alert("로그인이 필요합니다.");
    if (!contentField.current || !post._id || !contentField.current.innerHTML)
      return;
    setLoading(true);
    const body = {
      post: post._id,
      writer_name: nickname,
      content: contentField.current.innerText,
      createDate: parseInt(moment().format("YYYYMMDDHHmm")),
    };
    contentField.current.innerHTML = "";
    commentCreate(body).then((res) => {
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
        <TextArea ref={contentField} contentEditable="true" />
      </FlexDiv>
      <List>
        {commentList.length > 0 &&
          commentList.map((v, i) => (
            <CommentItem
              key={v.create_date}
              comment={v}
              postWriter={post.writer}
              setCommentsCount={setCommentsCount}
            />
          ))}
        {comments.length > 0 &&
          comments.map((v, i) => (
            <CommentItem
              key={v.create_date}
              comment={v}
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
  font-size: 14px;
  gap: 10px;
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
  }
`;
const Div = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
    width: 98%;
  }
`;
const TextArea = styled.div`
  display: inline-block;
  width: 90%;
  height: 150px;
  outline: none;
  border: none;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    width: 98%;
    height: 80px;
  }
`;

const SubmitBtn = styled.button`
  padding: 6px;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.button};
  cursor: pointer;
  border-radius: 2px;
  background: #fff;
  color: ${(props) => props.theme.colors.button};
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

import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { useComment } from "../../hooks/useComment";
import { BsArrowReturnRight } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import ChildComment from "./ChildComment";
import { CommentType } from "../../types/dataType";
import Loading from "../common/Loading";

type PropTypes = {
  comment: CommentType;
  postWriter: string;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
};
type StyleType = {
  noMatch?: boolean;
  active?: boolean;
};
const CommentItem: React.FC<PropTypes> = ({
  comment,
  postWriter,
  setCommentsCount,
}) => {
  const { commentUpdate, commentDelete, replyCreate } = useComment();
  const [updateClick, setUpdateClick] = useState(false);
  const [replyClick, setReplyClick] = useState(false);
  const updateField = useRef<HTMLParagraphElement>(null);
  const replyField = useRef<HTMLParagraphElement>(null);
  const { objectId, nickname } = useSelector((state: RootState) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [replies, setReplies] = useState<CommentType[]>();
  const [updateDesc, setUpdateDesc] = useState("");
  useEffect(() => {
    if (comment.childComment) {
      setReplies(comment.childComment);
    }
  }, []);

  useEffect(() => {
    if (updateClick) {
      if (!updateField.current) return;
      if (updateDesc) {
        updateField.current.innerHTML = updateDesc;
      } else {
        updateField.current.innerHTML = comment.content;
      }
      updateField.current.focus();
    }
    if (replyClick) {
      replyField.current?.focus();
    }
  }, [updateClick, replyClick]);

  const onDelete = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      if (window.confirm("댓글을 삭제하시겠습니까?")) {
        const target = e.target as HTMLSpanElement;
        if (!target.dataset.comment) return;
        setIsDelete(true);
        commentDelete(target.dataset.comment).then((res) => {
          console.log(res);
          if (replies) {
            setCommentsCount(res.comments_count - (1 + replies.length));
          } else {
            setCommentsCount(res.comments_count - 1);
          }
        });
      }
    },
    [commentDelete, setCommentsCount]
  );
  const onUpdate = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      const target = e.target as HTMLSpanElement;
      if (!target.dataset.comment) return;
      if (!updateField.current) return;
      const content = updateField.current.innerText;
      if (!content) return;
      setUpdateClick(false);
      setUpdateDesc(content);
      commentUpdate(target.dataset.comment, content);
    },
    [commentUpdate]
  );
  const onReply = useCallback(() => {
    if (!params.postId || !replyField.current) return;
    if (!replyField.current.innerText) return;
    setLoading(true);
    const body = {
      parentCommentId: comment._id,
      post: comment.post,
      writer_name: nickname,
      content: replyField.current.innerText,
      createDate: parseInt(moment().format("YYYYMMDDHHmm")),
      reply_user: comment.writer,
      reply_name: comment.writer_name,
      reply_comment: comment._id,
    };
    replyField.current.innerText = "";
    setReplyClick(false);
    replyCreate(body).then((res) => {
      setReplies((prev) => prev?.concat(res.comment));
      setCommentsCount(res.comments_count + 1);
      setLoading(false);
    });
  }, [comment, nickname, params, replyCreate, setCommentsCount]);

  const onUserDetail = useCallback(() => {
    navigate(`/user/${comment.writer}`);
  }, [comment, navigate]);
  return (
    <>
      {!isDelete && !comment.reply_comment && (
        <Item>
          <Header>
            <Nickname
              active={comment.writer === postWriter}
              onClick={onUserDetail}
            >
              {comment.writer_name}
            </Nickname>
            <ControllDiv noMatch={objectId !== comment.writer && true}>
              {moment().format("YYYYMMDD") ===
              String(comment.create_date).substring(0, 8) ? (
                <span>
                  {String(comment.create_date).substring(8, 10) +
                    ":" +
                    String(comment.create_date).substring(10, 12)}
                </span>
              ) : (
                <span>
                  {String(comment.create_date).substring(4, 6) +
                    "/" +
                    String(comment.create_date).substring(6, 8)}
                </span>
              )}

              {!updateClick && objectId === comment.writer && (
                <>
                  <ControllBtn
                    onClick={() => {
                      setUpdateClick(true);
                    }}
                  >
                    수정
                  </ControllBtn>
                  <ControllBtn data-comment={comment._id} onClick={onDelete}>
                    삭제
                  </ControllBtn>
                </>
              )}
            </ControllDiv>
          </Header>
          {updateClick && (
            <>
              <UpdateField contentEditable="true" ref={updateField} />
              <ControllDiv>
                <ControllBtn data-comment={comment._id} onClick={onUpdate}>
                  완료
                </ControllBtn>
                <ControllBtn
                  onClick={() => {
                    setUpdateClick(false);
                  }}
                >
                  취소
                </ControllBtn>
              </ControllDiv>
            </>
          )}
          {!updateClick && !updateDesc && <Content>{comment.content}</Content>}
          {updateDesc && !updateClick && <Content>{updateDesc}</Content>}
          {!updateClick && !replyClick && objectId && (
            <ReplyBtn
              onClick={() => {
                setReplyClick(true);
              }}
            >
              답글
            </ReplyBtn>
          )}
          {replyClick && (
            <>
              <BsArrowReturnRight />
              <ReplyBox>
                <ReplyField ref={replyField} contentEditable="true" />

                <ReplyControllBtn data-comment={comment._id} onClick={onReply}>
                  완료
                </ReplyControllBtn>
                <ReplyControllBtn
                  onClick={() => {
                    setReplyClick(false);
                  }}
                >
                  취소
                </ReplyControllBtn>
              </ReplyBox>
            </>
          )}
        </Item>
      )}
      {loading && <Loading />}

      {!isDelete &&
        !loading &&
        comment.childComment &&
        replies &&
        replies.map((v, i) => (
          <ChildComment
            key={i}
            comment={v}
            postWriter={postWriter}
            setCommentsCount={setCommentsCount}
          >
            {v.content}
          </ChildComment>
        ))}
    </>
  );
};

export default CommentItem;
const Item = styled.div`
  display: flex;
  justify-content: start;
  align-items: flex-start;
  flex-direction: column;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  padding: 10px 0;
  position: relative;
  width: 100%; ;
`;
const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const Nickname = styled.span<StyleType>`
  font-weight: 600;
  color: ${(props) =>
    props.active ? props.theme.colors.button : props.theme.colors.main};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    font-weight: 400;
    width: 40%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
`;
const ControllDiv = styled.div<StyleType>`
  font-size: 14px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
  }
`;
const ControllBtn = styled.button`
  font-size: 14px;
  margin-right: 2px;
  border: none;
  outline: none;
  background: #fff;
  cursor: pointer;
  padding: 3px;
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
    font-size: 12px;
  }
`;
const ReplyBtn = styled.button`
  font-size: 14px;
  border: none;
  outline: none;
  background: #fff;
  cursor: pointer;
  color: #7e7e7e;
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
    font-size: 12px;
  }
`;

const Content = styled.p`
  margin: 6px 0;
`;
const UpdateField = styled.p`
  border: 1px solid ${(props) => props.theme.colors.buttonActive};
  outline: none;
  padding: 14px;
  margin: 6px 0;
  width: 100%;
`;

const ReplyBox = styled.div`
  width: 80%;
  margin-left: 5%;
`;
const ReplyField = styled.p`
  width: 100%;
  height: 100px;
  border: 1px solid ${(props) => props.theme.colors.buttonActive};
  outline: none;
  padding: 4px;
`;
const ReplyControllBtn = styled.button`
  font-size: 14px;
  margin-right: 4px;
  border: none;
  outline: none;
  background: #fff;
  cursor: pointer;
  padding: 4px;
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
    font-size: 12px;
  }
`;

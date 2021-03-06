import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../app/store";
import { useComment } from "../../hooks/useComment";
import ChildComment from "./ChildComment";
import { CommentType } from "../../types/dataType";
import Loading from "../common/Loading";
import DateInfo from "../common/DateInfo";

type PropTypes = {
  comment: CommentType;
  postWriter: string;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
};

type StyleType = {
  noMatch?: boolean;
  active?: boolean;
};

const CommentItem = ({ comment, postWriter, setCommentsCount }: PropTypes) => {
  const navigate = useNavigate();

  const { updateComment, deleteComment, replyCreate } = useComment();

  const { objectId, nickname } = useSelector((state: RootState) => state.user);

  const [updateClick, setUpdateClick] = useState(false);
  const [replyClick, setReplyClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [replies, setReplies] = useState<CommentType[]>();
  const [updatedCommentValue, setUpdatedCommentValue] = useState(
    comment.content
  );
  const [replyValue, setReplyValue] = useState("");

  useEffect(() => {
    if (comment.childComment) {
      setReplies(comment.childComment);
    }
  }, [comment.childComment]);

  const onDelete = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      if (window.confirm("댓글을 삭제하시겠습니까?")) {
        const target = e.target as HTMLSpanElement;
        if (!target.dataset.comment) return;
        setIsDelete(true);
        deleteComment(target.dataset.comment).then((res) => {
          if (replies) {
            setCommentsCount(res.comments_count - (1 + replies.length));
          } else {
            setCommentsCount(res.comments_count - 1);
          }
        });
      }
    },
    [deleteComment, setCommentsCount, replies]
  );

  const onUpdate = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      const target = e.target as HTMLSpanElement;
      if (!target.dataset.comment) return;
      setUpdateClick(false);
      updateComment(target.dataset.comment, updatedCommentValue);
    },
    [updateComment, updatedCommentValue]
  );

  const onReply = useCallback(() => {
    if (!replyValue) return;
    setLoading(true);
    const body = {
      parentCommentId: comment._id,
      post: comment.post,
      writer_name: nickname,
      content: replyValue,
      createDate: parseInt(moment().format("YYYYMMDDHHmm")),
      reply_user: comment.writer,
      reply_name: comment.writer_name,
      reply_comment: comment._id,
    };
    setReplyValue("");
    setReplyClick(false);
    replyCreate(body).then((res) => {
      setReplies((prev) => prev?.concat(res.comment));
      setCommentsCount(res.comments_count + 1);
      setLoading(false);
    });
  }, [comment, nickname, replyCreate, setCommentsCount, replyValue]);

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
            <ControlDiv>
              <DateInfo date={comment.create_date} />

              {!updateClick && objectId === comment.writer && (
                <>
                  <ControlBtn
                    onClick={() => {
                      setUpdateClick(true);
                    }}
                  >
                    수정
                  </ControlBtn>
                  <ControlBtn data-comment={comment._id} onClick={onDelete}>
                    삭제
                  </ControlBtn>
                </>
              )}
            </ControlDiv>
          </Header>
          {updateClick && (
            <>
              <UpdateField
                value={updatedCommentValue}
                onChange={(e) => {
                  setUpdatedCommentValue(e.target.value);
                }}
              />
              <ControlDiv>
                <ControlBtn data-comment={comment._id} onClick={onUpdate}>
                  완료
                </ControlBtn>
                <ControlBtn
                  onClick={() => {
                    setUpdateClick(false);
                    setUpdatedCommentValue(comment.content);
                  }}
                >
                  취소
                </ControlBtn>
              </ControlDiv>
            </>
          )}
          {!updateClick && <Content>{updatedCommentValue}</Content>}
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
              <ReplyIcon src="../../../icon/reply.svg" alt="답글" />
              <ReplyBox>
                <ReplyField
                  value={replyValue}
                  onChange={(e) => {
                    setReplyValue(e.target.value);
                  }}
                />
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
        replies.map((reply, i) => (
          <ChildComment
            key={reply._id}
            comment={reply}
            postWriter={postWriter}
            setCommentsCount={setCommentsCount}
          />
        ))}
    </>
  );
};

const Item = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: flex-start;
  flex-direction: column;
  position: relative;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  padding: 10px 0;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Nickname = styled.span<StyleType>`
  font-weight: 600;
  color: ${(props) =>
    props.active ? props.theme.colors.button : props.theme.colors.fontColor};
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

const ControlDiv = styled.div`
  font-size: 0.875rem;
`;

const ControlBtn = styled.button`
  font-size: 0.875rem;
  margin-right: 2px;
  background: #fff;
  &:active {
    background: #fff;
  }

  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
  }
`;

const ReplyBtn = styled.button`
  font-size: 0.875rem;
  color: #7e7e7e;
  background: #fff;
  &:active {
    background: #fff;
  }

  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
  }
`;

const Content = styled.p`
  margin: 6px 0;
`;

const UpdateField = styled.textarea`
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.buttonActive};
  outline: none;
  padding: 14px;
  margin: 6px 0;
  resize: none;
`;

const ReplyBox = styled.div`
  width: 80%;
  margin-left: 5%;
`;

const ReplyField = styled.textarea`
  width: 100%;
  height: 100px;
  border: 1px solid ${(props) => props.theme.colors.buttonActive};
  outline: none;
  padding: 4px;
  resize: none;
`;

const ReplyControllBtn = styled.button`
  font-size: 0.875rem;
  margin-right: 4px;
  background: #fff;
  &:active {
    background: #fff;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
  }
`;

const ReplyIcon = styled.img`
  width: 30px;
  transform: rotate(180deg);
`;

export default CommentItem;

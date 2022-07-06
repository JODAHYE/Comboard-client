import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { RootState } from "../../app/store";
import { useComment } from "../../hooks/useComment";
import { CommentType } from "../../types/dataType";
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

const ChildComment = ({ comment, postWriter, setCommentsCount }: PropTypes) => {
  const navigate = useNavigate();

  const { updateComment, deleteComment } = useComment();

  const { objectId } = useSelector((state: RootState) => state.user);

  const [updateClick, setUpdateClick] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [updatedCommentValue, setUpdatedCommentValue] = useState(
    comment.content
  );

  const onDelete = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      if (window.confirm("댓글을 삭제하시겠습니까?")) {
        const target = e.target as HTMLSpanElement;
        if (!target.dataset.comment) return;
        setIsDelete(true);
        deleteComment(target.dataset.comment).then((res) => {
          setCommentsCount(res.comments_count - 1);
        });
      }
    },
    [deleteComment, setCommentsCount]
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

  const onUserDetail = useCallback(() => {
    navigate(`/user/${comment.writer}`);
  }, [comment, navigate]);

  const updateButtonClick = useCallback(() => {
    setUpdateClick(true);
  }, []);

  const inputUpdateField = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUpdatedCommentValue(e.target.value);
    },
    []
  );

  const closeUpdateField = useCallback(() => {
    setUpdateClick(false);
    setUpdatedCommentValue(comment.content);
  }, [comment]);

  return (
    <>
      {!isDelete && (
        <Item>
          {comment && (
            <>
              <Header>
                <Nickname
                  active={comment.writer === postWriter}
                  onClick={onUserDetail}
                >
                  {comment.writer_name}
                </Nickname>
                <ControllDiv noMatch={objectId !== comment.writer && true}>
                  <DateInfo date={comment.create_date} />
                  {!updateClick && objectId === comment.writer && (
                    <>
                      <ControllBtn onClick={updateButtonClick}>
                        수정
                      </ControllBtn>
                      <ControllBtn
                        data-comment={comment._id}
                        onClick={onDelete}
                      >
                        삭제
                      </ControllBtn>
                    </>
                  )}
                </ControllDiv>
              </Header>
              {updateClick && (
                <>
                  <UpdateField
                    value={updatedCommentValue}
                    onChange={inputUpdateField}
                  />
                  <ControllDiv>
                    <ControllBtn data-comment={comment._id} onClick={onUpdate}>
                      완료
                    </ControllBtn>
                    <ControllBtn onClick={closeUpdateField}>취소</ControllBtn>
                  </ControllDiv>
                </>
              )}
              {!updateClick && <Content>{updatedCommentValue}</Content>}
            </>
          )}
        </Item>
      )}
    </>
  );
};

const Item = styled.div`
  width: 92%;
  display: flex;
  justify-content: start;
  align-items: flex-start;
  flex-direction: column;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  padding: 10px 0;
  position: relative;
  margin: 0 auto;
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
    width: 40%;
    font-weight: 400;
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
  background: #fff;

  &:active {
    background: #fff;
  }

  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
    font-size: 12px;
  }
`;

const UpdateField = styled.textarea`
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.buttonActive};
  outline: none;
  padding: 14px;
  margin: 6px 0;
  resize: none;
`;

const Content = styled.p`
  margin: 6px 0;
`;

export default ChildComment;

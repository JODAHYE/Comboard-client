import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { useComment } from "../../hooks/useComment";
import { CommentType } from "../../types/dataType";

type PropTypes = {
  comment: CommentType;
  postWriter: string;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
};
type StyleType = {
  noMatch?: boolean;
  active?: boolean;
};
const ChildComment: React.FC<PropTypes> = ({
  comment,
  postWriter,
  setCommentsCount,
}) => {
  const { commentUpdate, commentDelete } = useComment();
  const [updateClick, setUpdateClick] = useState(false);
  const updateField = useRef<HTMLParagraphElement>(null);
  const { objectId } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [updateDesc, setUpdateDesc] = useState("");
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
  }, [updateClick]);
  const onDelete = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      if (window.confirm("댓글을 삭제하시겠습니까?")) {
        const target = e.target as HTMLSpanElement;
        if (!target.dataset.comment) return;
        setIsDelete(true);
        commentDelete(target.dataset.comment).then((res) => {
          setCommentsCount(res.comments_count - 1);
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
    [commentUpdate, setCommentsCount]
  );
  const onUserDetail = useCallback(() => {
    navigate(`/user/${comment.writer}`);
  }, [comment, navigate]);
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
              {!updateClick && !updateDesc && (
                <Content>{comment.content}</Content>
              )}
              {updateDesc && !updateClick && <Content>{updateDesc}</Content>}
            </>
          )}
        </Item>
      )}
    </>
  );
};

export default ChildComment;
const Item = styled.div`
  display: flex;
  justify-content: start;
  align-items: flex-start;
  flex-direction: column;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  padding: 10px 0;
  position: relative;
  width: 92%;
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
const UpdateField = styled.p`
  border: 1px solid ${(props) => props.theme.colors.buttonActive};
  outline: none;
  padding: 14px;
  margin: 6px 0;
  width: 100%;
`;
const Content = styled.p`
  margin: 6px 0;
`;

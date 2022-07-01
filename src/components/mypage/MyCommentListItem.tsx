import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { useBoard } from "../../hooks/useBoard";
import { PostType } from "../../types/dataType";

type CommentType = {
  _id: string;
  writer: string;
  post: PostType;
  writer_name: string;
  content: string;
  create_date: number;
  childComment: string[];
};

type PropsType = {
  comment: CommentType;
  setCheckList: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  checkList?: string[];
};

type StyleType = {
  width?: string;
  info?: string;
};

const MyCommentListItem = ({ comment, setCheckList, checkList }: PropsType) => {
  const navigate = useNavigate();

  const { isExistBoard } = useBoard();

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        setCheckList((prev) => prev?.concat([target.value]));
      } else {
        if (!checkList) return;
        const arr = checkList.filter((v, i) => v !== target.value);
        setCheckList(arr);
      }
    },
    [checkList, setCheckList]
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      isExistBoard(comment.post.board).then((res) => {
        if (res) {
          navigate(`/board/${comment.post.board}/${comment.post._id}`);
        }
      });
    },
    [comment, navigate, isExistBoard]
  );
  if (!comment.post) return null;
  return (
    <Wrap>
      <Title onClick={onClick}>{comment.content}</Title>
      <Info width="7%">
        {String(comment.create_date).substring(4, 6) +
          "/" +
          String(comment.create_date).substring(6, 8)}
      </Info>
      <Info width="18%">{comment.post.title}</Info>
      <Checkbox
        type="checkbox"
        onChange={onChange}
        value={`${comment._id}-${comment.post._id}`}
      />
    </Wrap>
  );
};

export default MyCommentListItem;

const Wrap = styled.div`
  width: 100%;
  ${(props) => props.theme.displayFlex};
  justify-content: start;
  gap: 4px;
  margin-bottom: 10px;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  @media (min-width: 320px) and (max-width: 480px) {
    flex-wrap: wrap;
    gap: 5px;
  }
`;

const Title = styled.div`
  width: 75%;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 6px 0;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
  }
`;

const Info = styled.p<StyleType>`
  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 14px;
  @media (min-width: 320px) and (max-width: 480px) {
    width: auto;
    max-width: 70%;
    margin-right: 6px;
    font-size: 11px;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-left: 10px;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 16px;
    height: 16px;
  }
`;

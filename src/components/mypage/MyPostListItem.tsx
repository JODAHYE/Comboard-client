import styled from "styled-components";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useBoard } from "../../hooks/useBoard";
import { PostType } from "../../types/dataType";

type PropsType = {
  post: PostType;
  setCheckList: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  checkList?: string[];
};
type StyleType = {
  width?: string;
  info?: string;
};
const MyPostListItem: React.FC<PropsType> = ({
  post,
  setCheckList,
  checkList,
}) => {
  const navigate = useNavigate();
  const { isExistBoard } = useBoard();
  useEffect(() => {
    if (!checkList) setCheckList([]);
  }, [checkList]);
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
  const onTitleClick = useCallback(() => {
    isExistBoard(post.board).then((res) => {
      if (res) {
        navigate(`/board/${post.board}/${post._id}`);
      }
    });
  }, [isExistBoard, post, navigate]);
  return (
    <PostItem data-post={post._id}>
      <Title onClick={onTitleClick}>
        <p>{post.title}</p>
        <span>{`[${post.comments_count}]`}</span>
      </Title>
      {moment().format("YYYYMMDD") ===
      String(post.create_date).substring(0, 8) ? (
        <Content width="6%">
          {String(post.create_date).substring(8, 10) +
            ":" +
            String(post.create_date).substring(10, 12)}
        </Content>
      ) : (
        <Content width="6%">
          {String(post.create_date).substring(4, 6) +
            "/" +
            String(post.create_date).substring(6, 8)}
        </Content>
      )}
      <Content width="6%" info="추천">
        {post.like}
      </Content>
      <Content width="6%" info="조회">
        {post.hits}
      </Content>
      <Checkbox type="checkbox" onChange={onChange} value={post._id} />
    </PostItem>
  );
};

export default MyPostListItem;
const PostItem = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  align-items: center;
  @media (min-width: 320px) and (max-width: 480px) {
    flex-wrap: wrap;
    gap: 5px;
  }
`;
const Content = styled.p<StyleType>`
  text-align: center;
  width: ${(props) => props.width && props.width};
  @media (min-width: 320px) and (max-width: 480px) {
    width: auto;
    margin-right: 6px;
    font-size: 11px;
    &:before {
      content: "${(props) => props.info && props.info}";
    }
  }
`;
const Title = styled.div`
  display: flex;
  width: 70%;
  cursor: pointer;
  padding: 6px 0;
  & > p {
    width: 91%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  & > span {
    font-size: 12px;
    display: inline-block;
    max-width: 9%;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
  }
`;
const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 16px;
    height: 16px;
  }
`;
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import moment from "moment";
import { useBoard } from "../../hooks/useBoard";
import { PostType } from "../../types/dataType";
import { useCallback } from "react";

type StyleType = {
  width?: string;
  info?: string;
};

const PostListItem = ({ post }: { post: PostType }) => {
  const navigate = useNavigate();

  const { isExistBoard } = useBoard();

  const onTitleClick = useCallback(() => {
    isExistBoard(post.board).then((res) => {
      if (res) {
        navigate(`/board/${post.board}/${post._id}`);
      }
    });
  }, [isExistBoard, post]);

  return (
    <PostItem data-post={post._id} onClick={onTitleClick}>
      <Title>
        <p>{post.title}</p>
        <span>{`[${post.comments_count}]`}</span>
      </Title>
      <Content width="12%">{post.writer_name && post.writer_name}</Content>
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
    </PostItem>
  );
};

export default PostListItem;

const PostItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  @media (min-width: 320px) and (max-width: 480px) {
    flex-wrap: wrap;
    gap: 5px;
  }
`;

const Title = styled.div`
  width: 70%;
  display: flex;
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
    @media (min-width: 320px) and (max-width: 480px) {
      max-width: 9%;
    }
  }
  @media (min-width: 320px) and (max-width: 480px) {
    flex-wrap: wrap;
    width: 100%;
  }
`;

const Content = styled.p<StyleType>`
  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `};
  display: inline-block;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (min-width: 320px) and (max-width: 480px) {
    width: auto;
    max-width: 50%;
    margin-right: 6px;
    font-size: 11px;
    &:before {
      ${(props) =>
        props.info &&
        css`
          content: ${props.info};
        `};
    }
  }
`;

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { CircularProgress } from "@mui/material";
import dompurify from "dompurify";

import { RootState } from "../app/store";
import CommentComp from "../components/comment/CommentComp";
import { getCurrentBoard } from "../features/boardSlice";
import { usePost } from "../hooks/usePost";
import { auth } from "../features/userSlice";
import { PostType } from "../types/dataType";
import MyInfoComp from "../components/common/MyInfoComp";
import Loading from "../components/common/Loading";
import { commentListInit } from "../features/commentSlice";

const PostDetail = () => {
  const cookies = new Cookies();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    getPostDetail,
    clickLike,
    clickDislike,
    deletePost,
    scrapPost,
    deleteScrapPost,
    increasePostView,
  } = usePost();

  const sanitizer = dompurify.sanitize;

  const { currentBoard } = useSelector((state: RootState) => state.board);
  const { is_auth, objectId, like_post, dislike_post, scrap_post } =
    useSelector((state: RootState) => state.user);

  const [post, setPost] = useState<PostType>();
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    dispatch(commentListInit());
    setLoading(true);
    getPostDetail().then((post) => {
      setPost(post);
      setLoading(false);
    });
    if (!params.id) return;
    dispatch(getCurrentBoard(params.id));
  }, []);

  useEffect(() => {
    if (!post) return;
    if (!post._id) return;
    if (!cookies.get(post._id)) {
      increasePostView(post._id);
    } else {
      return;
    }
  }, [post]);

  const onLike = useCallback(async () => {
    if (!post) return;
    if (like_post.includes(post._id)) return alert("?????? ?????????????????????.");
    setButtonLoading(true);
    clickLike(post._id).then(() => {
      getPostDetail().then((post) => {
        setPost(post);
      });
      dispatch(auth());
      setButtonLoading(false);
    });
  }, [clickLike, getPostDetail, like_post, post]);

  const onDisLike = useCallback(async () => {
    if (!post) return;
    if (dislike_post.includes(post._id)) return alert("?????? ?????????????????????.");
    setButtonLoading(true);
    clickDislike(post._id).then(() => {
      getPostDetail().then((post) => {
        setPost(post);
        dispatch(auth());
        setButtonLoading(false);
      });
    });
  }, [clickDislike, dislike_post, getPostDetail, post]);

  const onUpdate = useCallback(() => {
    if (!post) return;
    navigate(`/board/${currentBoard._id}/${post._id}/update`);
  }, [currentBoard, post]);

  const onDelete = useCallback(() => {
    if (window.confirm("???????????? ?????????????????????????")) {
      deletePost().then(() => {
        alert("?????????????????????.");
        navigate(`/board/${currentBoard._id}`);
      });
    }
  }, [currentBoard, deletePost]);

  const onScrap = useCallback(() => {
    if (!post) return;
    if (scrap_post.includes(post._id)) {
      setButtonLoading(true);
      deleteScrapPost().then(() => {
        dispatch(auth());
        setButtonLoading(false);
      });
    } else {
      setButtonLoading(true);
      scrapPost().then(() => {
        dispatch(auth());
        setButtonLoading(false);
      });
    }
  }, [deleteScrapPost, post, scrapPost, scrap_post]);

  const onUserDetail = useCallback(() => {
    navigate(`/user/${post?.writer}`);
  }, [post]);

  const goPostListPage = useCallback(() => {
    navigate(`/board/${currentBoard._id}`);
  }, [currentBoard]);

  return (
    <Wrap>
      <Box>
        <BoardTitle onClick={goPostListPage}>{currentBoard.title}</BoardTitle>
        <PostTitle className="title">{post && post.title}</PostTitle>
        <InfoDiv>
          <Writer onClick={onUserDetail}>
            {!loading && post?.writer_name}
          </Writer>
          {!loading && post?.create_date && (
            <Info>
              {String(post?.create_date).substring(0, 4) +
                "/" +
                String(post?.create_date).substring(4, 6) +
                "/" +
                String(post?.create_date).substring(6, 8) +
                " " +
                String(post?.create_date).substring(8, 10) +
                ":" +
                String(post?.create_date).substring(10, 12)}
            </Info>
          )}
          {post?.writer === objectId && (
            <>
              <Button onClick={onUpdate}>??????</Button>
              <Button onClick={onDelete}>??????</Button>
            </>
          )}
        </InfoDiv>
        <InfoDiv className="right">
          <Info>?????? {post?.hits}</Info>
          <Info>?????? {post?.like}</Info>
        </InfoDiv>
        {post?.content ? (
          <Content
            dangerouslySetInnerHTML={{ __html: sanitizer(post.content) }}
          ></Content>
        ) : (
          <Loading />
        )}
        <Icons>
          {post && like_post.includes(post._id) ? (
            <Item>
              <Icon src="../../icon/thumbs-up.svg" onClick={onLike} />
              {post?.like}
            </Item>
          ) : (
            <Item>
              <Icon src="../../icon/thumbs-o-up.svg" onClick={onLike} />
              {post?.like}
            </Item>
          )}
          {post && dislike_post.includes(post._id) ? (
            <Item>
              <Icon onClick={onDisLike} src="../../icon/thumbs-down.svg" />
              {post?.dislike}
            </Item>
          ) : (
            <Item>
              <Icon onClick={onDisLike} src="../../icon/thumbs-o-down.svg" />
              {post?.dislike}
            </Item>
          )}
          {post && scrap_post.includes(post._id) ? (
            <Item>
              <Icon src="../../icon/download.svg" onClick={onScrap} />
            </Item>
          ) : (
            <Item>
              <Icon src="../../icon/download-outline.svg" onClick={onScrap} />
            </Item>
          )}
          {buttonLoading && <CircularProgress />}
        </Icons>
        <ListButton onClick={goPostListPage}>??????</ListButton>
        {post && <CommentComp post={post} />}
      </Box>
      {is_auth && <MyInfoComp />}
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 95vh;
  display: flex;
  justify-content: center;
  gap: 2%;
  padding: 50px 0;
  @media (min-width: 320px) and (max-width: 480px) {
    height: 94vh;
  }
`;

const Box = styled.div`
  width: 60%;
  position: relative;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 96%;
  }
`;

const BoardTitle = styled.h2`
  cursor: pointer;
  color: ${(props) => props.theme.colors.button};
  font-size: 1.125rem;
  padding-bottom: 10px;
  font-weight: 500;
  line-height: 1.2em;
  border-bottom: 2px solid ${(props) => props.theme.colors.buttonActive};
`;

const PostTitle = styled.p`
  padding-top: 20px;
  @media (min-width: 320px) and (max-width: 480px) {
    padding-top: 10px;
  }
`;

const InfoDiv = styled.div`
  width: 50%;
  display: inline-block;
  padding: 20px 0;
  font-size: 0.875rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  &.right {
    text-align: right;
    @media (min-width: 320px) and (max-width: 480px) {
      display: none;
    }
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 90%;
    padding: 10px 0;
  }
`;

const Info = styled.p`
  display: inline-block;
  margin-right: 8px;
`;

const Writer = styled.p`
  display: inline-block;
  cursor: pointer;
  margin-right: 8px;
  font-family: SpoqaHanSansNeoBold;
  &:hover {
    color: #000;
    text-decoration: underline;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 90%;
  }
`;

const Content = styled.div`
  line-height: 1.3em;
  padding: 10px 0;
`;

const ListButton = styled.button`
  width: 80px;
  text-align: center;
  margin: 30px 0;
  padding: 2px;
  color: #fff;
  font-size: 0.875rem;
  border-radius: 2px;
`;

const Button = styled.button`
  font-size: 0.875rem;
  background: #fff;
  margin-left: 10px;
  &:active {
    color: ${(props) => props.theme.colors.buttonActive};
  }
`;

const Icons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 30px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  border-radius: 10px;
  padding: 4px;
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
  display: inline-block;
  padding: 2px;
  ${(props) => props.theme.iconColor};
  cursor: pointer;
`;

export default PostDetail;

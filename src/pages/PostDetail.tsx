import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Cookies from "universal-cookie";
import { CircularProgress } from "@mui/material";
import { RootState } from "../app/store";
import CommentComp from "../components/comment/CommentComp";
import { getCurrentBoard } from "../features/boardSlice";
import { usePost } from "../hooks/usePost";
import { auth } from "../features/userSlice";
import { PostType } from "../types/dataType";
import MyInfoComp from "../components/common/MyInfoComp";
import Loading from "../components/common/Loading";
import { commentListInit } from "../features/commentSlice";
import dompurify from "dompurify";
import DateInfo from "../components/common/DateInfo";

const PostDetail: React.FC = () => {
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
  } = usePost();

  const sanitizer = dompurify.sanitize;

  const { currentBoard } = useSelector((state: RootState) => state.board);
  const { objectId, like_post, dislike_post, scrap_post } = useSelector(
    (state: RootState) => state.user
  );

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
      const body = {
        postId: post._id,
      };
      axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/post/increase/view`,
        body
      );
      cookies.set(post._id, post._id, {
        path: "/",
        maxAge: 60 * 60 * 12,
      });
    } else {
      return;
    }
  }, [post]);

  const onClick = () => {
    navigate(`/board/${currentBoard._id}`);
  };

  const onLike = async () => {
    if (!post) return;
    if (like_post.includes(post._id)) return alert("이미 추천하셨습니다.");
    setButtonLoading(true);
    clickLike(post._id).then(() => {
      getPostDetail().then((post) => {
        setPost(post);
      });
      dispatch(auth());
      setButtonLoading(false);
    });
  };

  const onDisLike = async () => {
    if (!post) return;
    if (dislike_post.includes(post._id)) return alert("이미 비추하셨습니다.");
    setButtonLoading(true);
    clickDislike(post._id).then(() => {
      getPostDetail().then((post) => {
        setPost(post);
        dispatch(auth());
        setButtonLoading(false);
      });
    });
  };

  const onUpdate = () => {
    if (!post) return;
    navigate(`/board/${currentBoard._id}/${post._id}/update`);
  };

  const onDelete = () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      deletePost().then(() => {
        alert("삭제하였습니다.");
        navigate(`/board/${currentBoard._id}`);
      });
    }
  };

  const onScrap = () => {
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
  };

  const onUserDetail = () => {
    navigate(`/user/${post?.writer}`);
  };

  return (
    <Wrap>
      <Box>
        <BoardTitle onClick={onClick}>{currentBoard.title}</BoardTitle>
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
              <Btn onClick={onUpdate}>수정</Btn>
              <Btn onClick={onDelete}>삭제</Btn>
            </>
          )}
        </InfoDiv>
        <InfoDiv className="right">
          <Info>조회 {post?.hits}</Info>
          <Info>추천 {post?.like}</Info>
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
        <ListBtn
          onClick={() => {
            navigate(`/board/${currentBoard._id}`);
          }}
        >
          목록
        </ListBtn>
        {post && <CommentComp post={post} />}
      </Box>
      <MyInfoComp />
    </Wrap>
  );
};

export default PostDetail;

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
  font-size: 18px;
  padding-bottom: 10px;
  font-weight: 500;
  line-height: 1.2em;
  border-bottom: 2px solid ${(props) => props.theme.colors.buttonActive};
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 14px;
  }
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
  font-size: 14px;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  &.right {
    text-align: right;
    @media (min-width: 320px) and (max-width: 480px) {
      display: none;
    }
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 90%;
    font-size: 12px;
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

const ListBtn = styled.button`
  width: 80px;
  display: block;
  background: ${(props) => props.theme.colors.button};
  margin: 30px 0;
  padding: 2px;
  color: #fff;
  font-size: 14px;
  border-radius: 2px;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
`;

const Btn = styled.button`
  font-size: 14px;
  background: #fff;
  margin-left: 10px;
  &:active {
    color: ${(props) => props.theme.colors.buttonActive};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
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

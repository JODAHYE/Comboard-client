import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";

import { RootState } from "../app/store";
import { getCurrentBoard } from "../features/boardSlice";
import { usePost } from "../hooks/usePost";
import PostWriteOption from "../components/post/PostWriteOption";
import { PostType } from "../types/dataType";

const PostWrite = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contentField = useRef<HTMLDivElement>(null);
  const [post, setPost] = useState<PostType>();

  const { getPostDetail, createPost, updatePost } = usePost();

  const { currentBoard } = useSelector((state: RootState) => state.board);
  const { objectId } = useSelector((state: RootState) => state.user);
  const { nickname } = useSelector((state: RootState) => state.user);
  const [showCode, setShowCode] = useState(false);
  const [postTitle, setPostTitle] = useState("");

  useEffect(() => {
    if (!params.id) return;
    if (!objectId) {
      return navigate("/");
    }
    dispatch(getCurrentBoard(params.id));
    if (params.postId) {
      getPostDetail().then((res) => {
        setPost(res);
        setPostTitle(res.title);
      });
    }
  }, []);

  useEffect(() => {
    if (params.postId && post) {
      if (!objectId || post.writer !== objectId) {
        alert("잘못된 접근입니다.");
        return navigate("/");
      }
    }
  }, [post]);

  const onSubmit = () => {
    if (!contentField.current) return;
    const body = {
      title: postTitle,
      writer: objectId,
      writer_name: nickname,
      content: showCode
        ? contentField.current.innerText
        : contentField.current.innerHTML,
      create_date: parseInt(moment().format("YYYYMMDDHHmmss")),
      board: currentBoard._id,
    };
    if (!body.title || !body.content)
      return alert("제목과 내용을 입력해주세요.");

    if (params.postId) {
      updatePost(body).then((res) => {
        alert("게시글을 수정하였습니다.");
        navigate(`/board/${params.id}/${res.post._id}`);
      });
    } else {
      createPost(body).then((res) => {
        alert(res.msg);
        navigate(`/board/${params.id}/${res.post._id}`);
      });
    }
  };

  const inputPostTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPostTitle(e.target.value);
    },
    []
  );

  const goPostListPage = useCallback(() => {
    if (window.confirm("작성을 취소하시겠습니까?")) {
      navigate(`/board/${params._id}`);
    }
  }, [params._id]);

  return (
    <Wrap>
      <Box>
        <Div>
          <Title>{currentBoard.title}</Title>
          <div>
            <SubmitBtn onClick={goPostListPage}>목록</SubmitBtn>
            <SubmitBtn onClick={onSubmit}>완료</SubmitBtn>
          </div>
        </Div>
        <Input
          type="text"
          placeholder="제목"
          value={postTitle}
          onChange={inputPostTitle}
        />
        <PostWriteOption
          contentField={contentField}
          showCode={showCode}
          setShowCode={setShowCode}
        />
        {!params.postId && (
          <Content
            ref={contentField}
            contentEditable={true}
            spellCheck={false}
          ></Content>
        )}
        {params.postId && post && (
          <Content
            ref={contentField}
            contentEditable={true}
            spellCheck={false}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </Box>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 95vh;
  ${(props) => props.theme.displayFlex}
  flex-direction: column;
  padding: 10px;
  @media (min-width: 320px) and (max-width: 480px) {
    height: 94vh;
  }
`;

const Div = styled.div`
  width: 100%;
  ${(props) => props.theme.displayFlex}
  justify-content: space-between;
  @media (min-width: 320px) and (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const Title = styled.h3`
  display: inline-block;
  color: ${(props) => props.theme.colors.button};
  font-weight: 500;
`;

const Box = styled.div`
  width: 60%;
  height: 100%;
  ${(props) => props.theme.displayFlex}
  flex-direction: column;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  outline: none;
  font-size: 16px;
  &:focus {
    ${(props) => props.theme.displayFlex}
  }
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 14px;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 80%;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  outline: none;
  overflow-y: auto;
  line-height: 1.3em;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 14px;
    line-height: 1.2em;
    height: 50%;
  }
`;

const SubmitBtn = styled.button`
  display: inline-block;
  padding: 6px;
  border: 1px solid ${(props) => props.theme.colors.button};
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

export default PostWrite;

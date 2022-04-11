import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentBoard } from "../features/boardSlice";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { usePost } from "../hooks/usePost";
import PostWriteOption from "../components/post/PostWriteOption";
import { PostType } from "../types/dataType";

const PostWrite: React.FC = () => {
  const { getPostDetail, createPost, updatePost } = usePost();
  const contentField = useRef<HTMLDivElement>(null);
  const [showCode, setShowCode] = useState(false);
  const [post, setPost] = useState<PostType>();
  const params = useParams();
  const { currentBoard } = useSelector((state: RootState) => state.board);
  const { objectId } = useSelector((state: RootState) => state.user);
  const { nickname } = useSelector((state: RootState) => state.user);
  const [postTitle, setPostTitle] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    if (!contentField.current) return;
    if (params.postId && post) {
      if (!objectId || post.writer !== objectId) {
        alert("잘못된 접근입니다.");
        return navigate("/");
      }
      contentField.current.innerHTML = post.content;
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
      create_date: parseInt(moment(new Date()).format("YYYYMMDDHHmmss")),
      board: currentBoard._id,
    };
    if (!body.title || !body.content)
      return alert("제목과 내용을 입력해주세요.");

    if (params.postId) {
      // 게시글 수정
      updatePost(body).then((res) => {
        alert("게시글을 수정하였습니다.");
        navigate(`/board/${params.id}/${res.post._id}`);
      });
    } else {
      // 글 작성
      createPost(body).then((res) => {
        alert(res.msg);
        navigate(`/board/${params.id}/${res.post._id}`);
      });
    }
  };
  return (
    <Wrap>
      <Box>
        <Div>
          <Title>{currentBoard.title}</Title>
          <div>
            <SubmitBtn
              onClick={() => {
                if (window.confirm("작성을 취소하시겠습니까?")) {
                  navigate(`/board/${params.id}`);
                }
              }}
            >
              목록
            </SubmitBtn>
            <SubmitBtn onClick={onSubmit}>완료</SubmitBtn>
          </div>
        </Div>
        <Input
          type="text"
          placeholder="제목"
          value={postTitle}
          onChange={(e) => {
            setPostTitle(e.target.value);
          }}
        />
        <PostWriteOption
          contentField={contentField}
          showCode={showCode}
          setShowCode={setShowCode}
        />
        <Content
          ref={contentField}
          contentEditable="true"
          spellCheck="false"
        ></Content>
      </Box>
    </Wrap>
  );
};

export default PostWrite;
const Wrap = styled.div`
  width: 100%;
  height: 95vh;
  padding: 10px;
  ${(props) => props.theme.displayFlex}
  flex-direction: column;
  @media (min-width: 320px) and (max-width: 480px) {
    height: 94vh;
  }
`;
const Div = styled.div`
  ${(props) => props.theme.displayFlex}
  width: 100%;
  justify-content: space-between;
  @media (min-width: 320px) and (max-width: 480px) {
    flex-wrap: wrap;
  }
`;
const Title = styled.h3`
  color: ${(props) => props.theme.colors.button};
  font-weight: 500;
  display: inline-block;
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
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.button};
  cursor: pointer;
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

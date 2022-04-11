import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "../app/store";
import { getCurrentBoard } from "../features/boardSlice";
import PostList from "../components/post/PostList";
import Cookies from "universal-cookie";
import { BsBookmarkStar, BsBookmarkDashFill } from "react-icons/bs";
import { useBoard } from "../hooks/useBoard";
import { auth } from "../features/userSlice";
import MyInfoComp from "../components/common/MyInfoComp";

type StyleType = {
  width?: string;
};

const BoardDetail: React.FC = () => {
  const { bookmarkBoard, bookmarkBoardDelete } = useBoard();
  const cookies = new Cookies();
  const params = useParams();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { currentBoard } = useSelector((state: RootState) => state.board);
  const { bookmark } = useSelector((state: RootState) => state.user);
  const [sort, setSort] = useState("create_date");
  const navigate = useNavigate();
  useEffect(() => {
    if (!params.id) return;
    dispatch(getCurrentBoard(params.id));
  }, []);
  const onClick = () => {
    setIsOpen((prev) => !prev);
  };
  const onWrite = () => {
    if (!params.id) return;
    if (!cookies.get("accessToken")) return alert("로그인이 필요합니다.");
    navigate(`/board/${currentBoard._id}/write`);
  };
  const onBookmark = () => {
    if (bookmark.includes(currentBoard._id)) {
      bookmarkBoardDelete(currentBoard._id).then(() => {
        dispatch(auth());
      });
    } else {
      if (!cookies.get("accessToken")) return alert("로그인이 필요합니다.");
      bookmarkBoard(currentBoard._id).then(() => {
        alert("게시판 즐겨찾기 \n[pc버전 메인화면에서만 확인 가능합니다.]");
        dispatch(auth());
      });
    }
  };
  return (
    <Wrap>
      <Box>
        <Header>
          {bookmark.includes(currentBoard._id) ? (
            <RemoveBookmarkBtn onClick={onBookmark} />
          ) : (
            <AddBookmarkBtn onClick={onBookmark} />
          )}
          <Title
            onClick={() => {
              setIsOpen(false);
            }}
          >
            {currentBoard && currentBoard.title}
          </Title>
          <InfoBtn onClick={onClick}>정보</InfoBtn>
        </Header>
        {!isOpen ? (
          <>
            <InfoBox>
              <Info width="70%">제목</Info>
              <Info width="12%">작성자</Info>
              <Info width="6%">작성일</Info>
              <Info width="6%">추천</Info>
              <Info width="6%">조회</Info>
            </InfoBox>
            <PostList sort={sort} />
          </>
        ) : (
          <InfoWrap>
            {currentBoard.bgimg && (
              <Img src={currentBoard.bgimg} alt="게시판 사진" />
            )}
            <Desc>{currentBoard.description}</Desc>
            <Desc>게시글 수: {currentBoard.postCount}</Desc>
            {currentBoard.secretNumber && (
              <Desc>암호: {currentBoard.secretNumber}</Desc>
            )}
            <Desc>
              개설일: {String(currentBoard.create_date).substring(0, 8)}
            </Desc>
          </InfoWrap>
        )}
        <FlexDiv>
          <SortSelect
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <Option value="create_date">최신순</Option>
            <Option value="hits">조회순</Option>
            <Option value="like">추천순</Option>
            <Option value="comments_count">댓글순</Option>
          </SortSelect>
          <NewPostBtn onClick={onWrite}>글작성</NewPostBtn>
        </FlexDiv>
      </Box>
      <MyInfoComp />
    </Wrap>
  );
};

export default BoardDetail;
const Wrap = styled.div`
  width: 100%;
  height: 95vh;
  padding: 50px 0;
  display: flex;
  justify-content: center;
  gap: 2%;
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 94vh;
    padding: 10px 0;
  }
`;
const Box = styled.div`
  width: 60%;
  position: relative;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 96%;
    padding: 30px 0;
  }
`;
const Header = styled.div`
  border-bottom: 2px solid ${(props) => props.theme.colors.button};
  padding-bottom: 10px;
  display: flex;
`;
const Title = styled.h3`
  display: inline-block;
  cursor: pointer;
  font-weight: 500;
  color: #000;
  margin-right: 10px;
  max-width: 76%;
`;

const InfoBox = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.colors.button};
  padding: 6px 0;
  @media (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
`;
const Info = styled.p<StyleType>`
  text-align: center;
  width: ${(props) => props.width && props.width};
`;

const FlexDiv = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  margin: 0;
  gap: 10px;
`;

const NewPostBtn = styled.button`
  background: ${(props) => props.theme.colors.button};
  outline: none;
  border: none;
  padding: 2px;
  color: #fff;
  width: 100px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 2px;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px 6px;
    width: auto;
    font-size: 12px;
  }
`;
const SortSelect = styled.select`
  border: 1px solid ${(props) => props.theme.colors.shadow};
  outline: none;
  padding: 2px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
  }
`;

const Option = styled.option``;

const Desc = styled.p`
  display: inline-block;
  display: block;
  white-space: pre-wrap;
  font-size: 15px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
  }
`;
const InfoBtn = styled.button`
  outline: none;
  border: none;
  background: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  &::before {
    content: "|";
    margin-right: 4px;
    color: ${(props) => props.theme.colors.shadow};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
  }
`;

const AddBookmarkBtn = styled(BsBookmarkStar)`
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.button};
`;

const RemoveBookmarkBtn = styled(BsBookmarkDashFill)`
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.button};
`;
const Img = styled.img`
  display: inline-block;
  max-width: 80%;
`;
const InfoWrap = styled.div`
  width: 100%;
  padding: 10px;
`;
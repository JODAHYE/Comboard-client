import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";

import { RootState } from "../app/store";
import { getCurrentBoard } from "../features/boardSlice";
import PostList from "../components/post/PostList";
import { useBoard } from "../hooks/useBoard";
import { auth } from "../features/userSlice";
import MyInfoComp from "../components/common/MyInfoComp";
import BoardInfoComp from "../components/board/BoardInfoComp";

type StyleType = {
  width?: string;
};

const BoardDetail = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addBookmarkBoard, deleteBookmarkBoard } = useBoard();

  const { is_auth } = useSelector((state: RootState) => state.user);
  const { currentBoard } = useSelector((state: RootState) => state.board);
  const { bookmark } = useSelector((state: RootState) => state.user);
  const [sort, setSort] = useState("create_date");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    dispatch(getCurrentBoard(params.id));
  }, []);

  const onWrite = useCallback(() => {
    if (!params.id) return;
    if (!is_auth) return alert("로그인이 필요합니다.");
    navigate(`/board/${currentBoard._id}/write`);
  }, [currentBoard, params, is_auth]);

  const onBookmark = useCallback(() => {
    if (bookmark.includes(currentBoard._id)) {
      deleteBookmarkBoard(currentBoard._id).then(() => {
        alert("게시판 즐겨찾기 해제");
        dispatch(auth());
      });
    } else {
      if (!is_auth) return alert("로그인이 필요합니다.");
      addBookmarkBoard(currentBoard._id).then(() => {
        alert("게시판 즐겨찾기 \n[pc버전 메인화면에서만 확인 가능합니다.]");
        dispatch(auth());
      });
    }
  }, [addBookmarkBoard, bookmark, currentBoard, deleteBookmarkBoard, is_auth]);

  const onTitleClick = useCallback(() => {
    setIsInfoOpen(false);
  }, []);

  const onInfoClick = useCallback(() => {
    setIsInfoOpen(true);
  }, []);

  const sortClick = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  }, []);

  return (
    <Wrap>
      <Box>
        <Header>
          {bookmark.includes(currentBoard._id) ? (
            <Button onClick={onBookmark}>
              <Icon src="../../icon/bookmark-active.svg" alt="북마크" />
            </Button>
          ) : (
            <Button onClick={onBookmark}>
              <Icon src="../../icon/bookmarkicon-nonactive.svg" alt="북마크" />
            </Button>
          )}
          <Title onClick={onTitleClick}>
            {currentBoard && currentBoard.title}
          </Title>
          <InfoBtn onClick={onInfoClick}>정보</InfoBtn>
        </Header>
        {!isInfoOpen ? (
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
          <BoardInfoComp board={currentBoard} />
        )}
        <FlexDiv>
          <SortSelect onChange={sortClick}>
            <Option value="create_date">최신순</Option>
            <Option value="hits">조회순</Option>
            <Option value="like">추천순</Option>
            <Option value="comments_count">댓글순</Option>
          </SortSelect>
          <NewPostBtn onClick={onWrite}>글작성</NewPostBtn>
        </FlexDiv>
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
    flex-direction: column;
    align-items: center;
    justify-content: start;
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
  ${(props) => props.theme.displayFlex};
  justify-content: start;
  border-bottom: 2px solid ${(props) => props.theme.colors.button};
  padding-bottom: 10px;
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
  ${(props) =>
    props.width &&
    css`
      width: ${props.width};
    `};
  text-align: center;
`;

const FlexDiv = styled.div`
  display: flex;
  gap: 10px;
  position: absolute;
  right: 0;
  top: 0;
  margin: 0;
`;

const NewPostBtn = styled.button`
  width: 100px;
  color: #fff;
  border-radius: 2px;
  padding: 2px;
  font-size: 0.875rem;
  text-align: center;

  @media (min-width: 320px) and (max-width: 480px) {
    width: auto;
    padding: 2px 6px;
    font-size: 0.75rem;
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

const InfoBtn = styled.button`
  display: inline-block;
  background: #fff;
  font-size: 1rem;
  &::before {
    content: "|";
    margin-right: 4px;
    color: ${(props) => props.theme.colors.shadow};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const Button = styled.button`
  width: 24px;
  margin: 0 14px 0 0;
  background: #fff;
  &:active {
    background: #fff;
  }
`;

const Icon = styled.img``;

export default BoardDetail;

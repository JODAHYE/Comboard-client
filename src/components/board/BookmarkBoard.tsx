import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { RootState } from "../../app/store";
import { getAlertCount, getBookmarkList } from "../../features/userSlice";
import BookmarkBoardItem from "./BookmarkBoardItem";

const BookmarkBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bookmarkBoardList } = useSelector((state: RootState) => state.user);
  const { is_auth } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getBookmarkList());
    dispatch(getAlertCount());
  }, []);

  const onLoginPage = useCallback(() => {
    navigate("/login");
  }, []);

  return (
    <Wrap>
      {!is_auth ? (
        <Container>
          <p>서비스 이용을 위해 로그인 해주세요.</p>
          <LoginButton onClick={onLoginPage}>로그인</LoginButton>
        </Container>
      ) : (
        <>
          <Header>
            <p>즐겨찾기</p>
          </Header>
          <List>
            {bookmarkBoardList.map((item, i) => {
              return <BookmarkBoardItem key={item._id} board={item} />;
            })}
          </List>
        </>
      )}
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 20%;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  @media (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
`;

const Header = styled.div`
  ${(props) => props.theme.displayFlex};
  justify-content: space-around;

  font-family: SpoqaHanSansNeoBold;
  padding: 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
`;

const List = styled.div`
  padding: 30px 30px 30px;
  height: 94%;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const LoginButton = styled.button`
  all: unset;
  cursor: pointer;

  width: 100%;
  padding: 6px;

  background: ${(props) => props.theme.colors.buttonActive};
  color: #fff;
  margin-top: 30px;
  text-align: center;

  border-radius: 10px;
`;

const Container = styled.div`
  padding: 30px 30px 0;
`;

export default BookmarkBoard;

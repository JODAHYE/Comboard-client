import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import styled from "styled-components";

import { RootState } from "../app/store";
// import Login from "./Login";
import BookmarkBoard from "../components/board/BookmarkBoard";
import PrivateBoard from "../components/board/PrivateBoard";
import PublicBoard from "../components/board/PublicBoard";

const Main = () => {
  const { mainMenu } = useSelector((state: RootState) => state.menu);
  const location = useLocation();

  useEffect(() => {
    const code = location.search.substring(6);
    if (code) {
      window.location.replace("/");
    }
  }, []);

  return (
    <Wrap>
      <Container>
        {mainMenu === "공개 게시판" && <PublicBoard />}
        {mainMenu === "비밀 게시판" && <PrivateBoard />}
        <BookmarkBoard />
      </Container>
    </Wrap>
  );
};

export default Main;

const Wrap = styled.div`
  width: 100%;
  height: 95vh;
  overflow: hidden;
  @media (min-width: 320px) and (max-width: 480px) {
    height: 94vh;
    flex-direction: column;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  ${(props) => props.theme.displayFlex};
`;

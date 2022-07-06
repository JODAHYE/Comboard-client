import { useSelector } from "react-redux";
import styled from "styled-components";

import { RootState } from "../app/store";
import BookmarkBoard from "../components/board/BookmarkBoard";
import PrivateBoard from "../components/board/PrivateBoard";
import PublicBoard from "../components/board/PublicBoard";

const Main = () => {
  const { mainMenu } = useSelector((state: RootState) => state.menu);

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

export default Main;

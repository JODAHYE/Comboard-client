import { useSelector } from "react-redux";
import styled from "styled-components";

import { RootState } from "../app/store";
import Login from "../components/auth/Login";
import MyBoard from "../components/board/MyBoard";
import PrivateBoard from "../components/board/PrivateBoard";
import PublicBoard from "../components/board/PublicBoard";

const Main = () => {
  const { mainMenu } = useSelector((state: RootState) => state.menu);
  const { is_auth } = useSelector((state: RootState) => state.user);

  return (
    <Wrap>
      {mainMenu === "공개 게시판" && <PublicBoard />}
      {mainMenu === "비밀 게시판" && <PrivateBoard />}
      {is_auth ? (
        <Div>
          <MyBoard />
        </Div>
      ) : (
        <Div>
          <Login />
        </Div>
      )}
    </Wrap>
  );
};

export default Main;

const Wrap = styled.div`
  height: 95vh;
  width: 100%;
  ${(props) => props.theme.displayFlex};
  @media (min-width: 320px) and (max-width: 480px) {
    height: 94vh;
    flex-direction: column;
  }
`;

const Div = styled.div`
  width: 30%;
  height: 95vh;
  @media (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
`;

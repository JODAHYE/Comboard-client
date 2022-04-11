import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../app/store";
import Login from "../components/auth/Login";
import MyBoard from "../components/board/MyBoard";
import PrivateBoard from "../components/board/PrivateBoard";
import PublicBoard from "../components/board/PublicBoard";
const Wrap = styled.div`
  ${(props) => props.theme.displayFlex};
  height: 95vh;
  width: 100%;
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    height: 94vh;
  }
`;
const Div = styled.div`
  width: 30%;
  height: 95vh;
  @media (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
`;
const Main = () => {
  const { mainMenu } = useSelector((state: RootState) => state.menu);
  const { is_auth } = useSelector((state: RootState) => state.user);

  return (
    <Wrap>
      {/* {mainMenu === "공개 게시판" && <PublicBoard />} */}
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

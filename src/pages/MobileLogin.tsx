import styled from "styled-components";
import Login from "../components/auth/Login";

const MobileLogin = () => {
  return (
    <Wrap>
      <Login />
    </Wrap>
  );
};

export default MobileLogin;

const Wrap = styled.div`
  width: 100vw;
  height: 94vh;
  ${(props) => props.theme.displayFlex}
`;

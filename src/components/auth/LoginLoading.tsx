import { CircularProgress } from "@mui/material";
import styled from "styled-components";

const LoginLoading = () => {
  return (
    <Wrap>
      <CircularProgress size={50} />
    </Wrap>
  );
};

export default LoginLoading;

const Wrap = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 5vh;
  left: 0;
  z-index: 500;
  background: rgba(0, 0, 0, 0.6);
  ${(props) => props.theme.displayFlex};
  @media (min-width: 320px) and (max-width: 480px) {
    top: 6vh;
  }
`;

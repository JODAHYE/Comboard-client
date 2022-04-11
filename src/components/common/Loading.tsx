import styled from "styled-components";
import Skeleton from "@mui/material/Skeleton";
const Wrap = styled.div`
  width: 100%;
  margin-top: 40px;
`;
const Loading = () => {
  return (
    <Wrap>
      <Skeleton animation="wave" width={"40%"} height={30} />
      <Skeleton animation="wave" width={"60%"} height={40} />
      <Skeleton animation="wave" width={"50%"} height={25} />
    </Wrap>
  );
};

export default Loading;

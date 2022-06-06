import React from "react";
import styled from "styled-components";

const ContentWrap: React.FC = ({ children }) => {
  return <Wrap>{children}</Wrap>;
};

export default ContentWrap;

const Wrap = styled.div`
  width: 60%;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 30px;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    flex-direction: column;
  }
`;

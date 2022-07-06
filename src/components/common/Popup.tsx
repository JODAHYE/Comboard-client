import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { onPopupClick } from "../../features/menuSlice";

type PropsType = {
  children: React.ReactNode;
  height?: string;
};

const Popup = ({ children, height }: PropsType) => {
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(onPopupClick(""));
  }, [dispatch]);

  return (
    <Wrap>
      <Box height={height}>
        <CloseBtn onClick={onClose}>
          <img src="icon/close.svg" alt="닫기" />
        </CloseBtn>
        <Content>{children}</Content>
      </Box>
    </Wrap>
  );
};

const Wrap = styled.div`
  position: fixed;
  top: 5vh;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgb(0, 0, 0, 0.5);
  z-index: 500;
  @media (min-width: 320px) and (max-width: 480px) {
    top: 6vh;
  }
`;

const Box = styled.div<PropsType>`
  width: 50vw;
  height: ${(props) => {
    return props.height ? props.height : "60vh";
  }};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 5px;
  background: #fff;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 90%;
    padding: 2px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 5px;
  width: 26px;
  background: #fff;
  &:active {
    background: #fff;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  ${(props) => props.theme.displayFlex}
  flex-direction: column;
`;

export default Popup;

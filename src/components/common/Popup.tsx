import React, { useCallback } from "react";
import styled from "styled-components";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { onPopupClick } from "../../features/menuSlice";

type PropsType = {
  height?: string;
};
const Popup: React.FC<PropsType> = ({ children, height }) => {
  const dispatch = useDispatch();
  const onClose = useCallback(() => {
    dispatch(onPopupClick(""));
  }, [dispatch]);
  return (
    <Wrap>
      <Box height={height}>
        <CloseBtn onClick={onClose} />
        <Content>{children}</Content>
      </Box>
    </Wrap>
  );
};
export default Popup;
const Wrap = styled.div`
  top: 5vh;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
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
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 5px;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 90%;
    padding: 2px;
  }
`;
const CloseBtn = styled(MdOutlineClose)`
  font-size: 28px;
  position: absolute;
  right: 5px;
  cursor: pointer;
`;
const Content = styled.div`
  width: 100%;
  height: 100%;
  ${(props) => props.theme.displayFlex}
  flex-direction: column;
`;
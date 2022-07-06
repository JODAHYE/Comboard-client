import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

import { onPopupClick } from "../../features/menuSlice";
import { getAlertCount } from "../../features/userSlice";
import { useAlert } from "../../hooks/useAlert";
import { useBoard } from "../../hooks/useBoard";
import { usePost } from "../../hooks/usePost";
import { AlertType } from "../../types/dataType";
import DateInfo from "../common/DateInfo";

type StyleType = {
  isBlur: boolean;
};

const AlertItem = ({ alert }: { alert: AlertType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { alertRead } = useAlert();
  const { isExistBoard } = useBoard();
  const { isExistPost } = usePost();

  const [isRead, setIsRead] = useState(alert.isRead);

  const onClick = useCallback(() => {
    alertRead(alert._id).then(() => {
      setIsRead(true);
      dispatch(getAlertCount());
    });
    const info = alert.detailUrl.split("/");
    const boardId = info[2];
    const postId = info[3];
    isExistBoard(boardId).then((res) => {
      if (res) {
        isExistPost(postId).then((res) => {
          if (res) {
            navigate(alert.detailUrl);
          }
        });
      }
    });
    dispatch(onPopupClick(""));
  }, [alert, alertRead, dispatch, isExistBoard, isExistPost, navigate]);

  const onRead = useCallback(() => {
    alertRead(alert._id).then(() => {
      setIsRead(true);
      dispatch(getAlertCount());
    });
  }, [alert._id, alertRead, dispatch]);

  return (
    <Item isBlur={isRead}>
      <ContentDiv onClick={onClick}>
        <Info>
          <p>{alert.description}</p>
          <DateInfo date={alert.createDate} />
        </Info>
        <p>{alert.subdescription}</p>
      </ContentDiv>
      {!isRead && <IsRead onClick={onRead}>읽음</IsRead>}
    </Item>
  );
};

const Item = styled.div<StyleType>`
  width: 100%;
  ${(props) => props.theme.displayFlex};
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  ${(props) =>
    props.isBlur &&
    css`
      background: rgba(0, 0, 0, 0.05);
    `};
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
  }
`;

const ContentDiv = styled.div`
  width: 92%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  line-height: 1.2em;
  font-size: 14px;
  padding: 10px 0;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    font-size: 12px;
  }
`;
const Info = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  @media (min-width: 320px) and (max-width: 480px) {
    & > span {
      font-size: 11px;
    }
  }
`;
const IsRead = styled.button`
  background: #fff;
  color: ${(props) => props.theme.colors.button};
  border: 1px solid ${(props) => props.theme.colors.button};
  border-radius: 2px;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    padding: 6px;
    font-size: 10px;
  }
`;

export default AlertItem;

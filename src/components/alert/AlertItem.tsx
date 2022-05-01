import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { onPopupClick } from "../../features/menuSlice";
import { getAlertCount } from "../../features/userSlice";
import { useAlert } from "../../hooks/useAlert";
import { useBoard } from "../../hooks/useBoard";
import { usePost } from "../../hooks/usePost";
import { AlertType } from "../../types/dataType";

type StyleType = {
  blur?: boolean;
};

const AlertItem = ({ alert }: { alert: AlertType }) => {
  const { alertRead } = useAlert();
  const { isExistBoard } = useBoard();
  const { isExistPost } = usePost();
  const [isRead, setIsRead] = useState<boolean>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!alert.isRead) return;
    setIsRead(alert.isRead);
    console.log(alert);
  }, [alert]);
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
    <Item blur={isRead && true}>
      <ContentDiv onClick={onClick}>
        <Info>
          <p>{alert.description}</p>
          {moment().format("YYYYMMDD") ===
          String(alert.createDate).substring(0, 8) ? (
            <span>
              {String(alert.createDate).substring(8, 10) +
                ":" +
                String(alert.createDate).substring(10, 12)}
            </span>
          ) : (
            <span>
              {String(alert.createDate).substring(4, 6) +
                "/" +
                String(alert.createDate).substring(6, 8)}
            </span>
          )}
        </Info>
        <p>{alert.subdescription}</p>
      </ContentDiv>
      {!isRead && <IsRead onClick={onRead}>읽음</IsRead>}
    </Item>
  );
};

export default AlertItem;
const Item = styled.div<StyleType>`
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
  ${(props) => props.theme.displayFlex};
  width: 100%;
  background: ${(props) => props.blur && "rgba(0, 0, 0, 0.05)"};
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
  }
`;
const ContentDiv = styled.div`
  width: 92%;
  cursor: pointer;
  padding: 6px;
  line-height: 1.2em;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    font-size: 12px;
  }
`;
const Info = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  @media (min-width: 320px) and (max-width: 480px) {
    & > span {
      font-size: 11px;
    }
  }
`;
const IsRead = styled.button`
  outline: none;
  border: none;
  background: #fff;
  color: ${(props) => props.theme.colors.button};
  border: 1px solid ${(props) => props.theme.colors.button};
  border-radius: 2px;
  padding: 4px;
  cursor: pointer;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    padding: 6px;
    font-size: 10px;
  }
`;

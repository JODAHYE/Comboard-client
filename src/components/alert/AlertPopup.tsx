import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useAlert } from "../../hooks/useAlert";
import { AlertType } from "../../types/dataType";
import Loading from "../common/Loading";
import Popup from "../common/Popup";
import AlertItem from "./AlertItem";

const AlertPopup = () => {
  const target = useRef<HTMLDivElement>(null);

  const { getAlertList, alertDelete } = useAlert();

  const [alertList, setAlertList] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertEnd, setAlertEnd] = useState(false);

  let skip = 0;

  useEffect(() => {
    setLoading(true);
    getAlertList(skip).then((res) => {
      setAlertList(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!target.current) return;
    const observer = new IntersectionObserver(callback, {
      threshold: 0.8,
    });
    observer.observe(target.current);
    return () => {
      observer && observer.disconnect();
    };
  }, [target]);

  const callback = async (
    [entry]: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    if (entry.isIntersecting && !loading && !alertEnd) {
      observer.unobserve(entry.target);
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      skip += 11;
      getAlertList(skip).then((res) => {
        if (res.length < 11) {
          setAlertEnd(true);
        }
        if (res.length > 0) {
          setAlertList((prev) => prev.concat(res));
        }
        setLoading(false);
      });
      observer.observe(entry.target);
    }
  };

  const onDelete = useCallback(() => {
    if (window.confirm("읽은 알림을 삭제하시겠습니까?")) {
      alertDelete().then(() => {
        setAlertList([]);
        getAlertList(skip).then((res) => {
          setAlertList(res);
        });
      });
    }
  }, [getAlertList, alertDelete, skip]);

  return (
    <Popup height={"85%"}>
      <Header>
        <Title>알림</Title>
        <Icon
          src="../../../icon/trash.svg"
          title="읽은 알림 삭제"
          onClick={onDelete}
        />
      </Header>
      <List>
        {alertList &&
          alertList.length > 0 &&
          alertList.map((alert, i) => {
            return <AlertItem key={alert._id} alert={alert} />;
          })}
        {!alertEnd && (
          <Target ref={target}>
            <Loading />
          </Target>
        )}
      </List>
    </Popup>
  );
};
export default AlertPopup;

const Header = styled.div`
  width: 90%;
  position: relative;
  margin: 20px;
`;

const Title = styled.h3`
  font-family: BMHANNAAir;
  font-size: 22px;
  color: #000;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 18px;
  }
`;

const Icon = styled.img`
  position: absolute;
  top: 0px;
  right: 30px;
  cursor: pointer;
  &:hover {
    ${(props) => props.theme.iconColor}
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 18px;
    height: 18px;
  }
`;

const List = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Target = styled.div`
  width: 100%;
  height: 300px;
`;

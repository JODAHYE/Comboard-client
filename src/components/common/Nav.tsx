import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { RootState } from "../../app/store";
import { mainMenuClick, onPopupClick } from "../../features/menuSlice";
import { auth, logout } from "../../features/userSlice";
import { board_init } from "../../features/boardSlice";
import { useMenu } from "../../hooks/useMenu";
import AlertPopup from "../alert/AlertPopup";
import LoginLoading from "../auth/LoginLoading";

type StyleType = {
  alert: number;
};

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { mainMenu, onPopup } = useSelector((state: RootState) => state.menu);
  const { is_auth, profileImage, alertCount, loginLoading } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(auth());
    const code = location.search.substring(6);
    if (code && is_auth) {
      navigate("/", { replace: true });
    }
  }, [is_auth]);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const target = e.target as HTMLElement;
      if (!target.innerText) {
        dispatch(mainMenuClick("북마크"));
      }
      dispatch(mainMenuClick(target.innerHTML));
      dispatch(onPopupClick(""));
      dispatch(board_init());
    },
    [dispatch]
  );

  const openAlertPopup = useCallback(() => {
    dispatch(onPopupClick("alert"));
  }, []);

  const onLogout = useCallback(() => {
    dispatch(onPopupClick(""));
    dispatch(logout());
  }, []);

  const goToLoginPage = useCallback(() => {
    navigate("/login");
  }, []);

  return (
    <Wrap>
      <Container>
        <Menu>
          <MenuItem
            to="/"
            onClick={onClick}
            className={useMenu(mainMenu, "공개 게시판") ? "active" : undefined}
          >
            공개 게시판
          </MenuItem>
          <MenuItem
            to="/"
            onClick={onClick}
            className={useMenu(mainMenu, "비밀 게시판") ? "active" : undefined}
          >
            비밀 게시판
          </MenuItem>
        </Menu>

        {!is_auth && !loginLoading && (
          <LoginBtn onClick={goToLoginPage}>로그인</LoginBtn>
        )}

        {loginLoading && <LoginLoading />}

        {!loginLoading && is_auth && (
          <MyInfo>
            <Link to="/mypage">
              {profileImage ? (
                <ProfileImg src={profileImage} title="마이페이지" />
              ) : (
                <Icon src="../../../icon/user.svg" title="마이페이지" />
              )}
            </Link>
            <Alert alert={alertCount}>
              <Icon
                src="../../../icon/notification.svg"
                title="알림"
                onClick={openAlertPopup}
              />
            </Alert>
            <Icon
              src="../../../icon/exit.svg"
              title="로그아웃"
              onClick={onLogout}
            />
          </MyInfo>
        )}
        {onPopup === "alert" && <AlertPopup />}
      </Container>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100vw;
  height: 5vh;

  ${(props) => props.theme.displayFlex}
  justify-content: center;

  background: #fff;
  box-shadow: 2px 2px 2px 2px ${(props) => props.theme.colors.shadow};
  padding: 0 50px;

  @media (min-width: 320px) and (max-width: 480px) {
    padding: 0 10px;
    height: 6vh;
  }
`;

const Container = styled.div`
  width: 80%;
  height: 100%;

  ${(props) => props.theme.displayFlex}
  justify-content: space-between;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
  }
`;

const Menu = styled.div`
  display: flex;
  gap: 30px;

  @media (min-width: 320px) and (max-width: 480px) {
    gap: 6px;
  }
`;

const MenuItem = styled(Link)`
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  font-family: SpoqaHanSansNeoBold;
  color: ${(props) => props.theme.colors.fontColor};
  &.active {
    color: #000;
  }
`;

const LoginBtn = styled.button`
  display: none;

  @media (min-width: 320px) and (max-width: 480px) {
    display: block;
    font-size: 0.875rem;
    color: #fff;
    padding: 2px;
    border-radius: 4px;
    background: ${(props) => props.theme.colors.button};
  }
`;

const MyInfo = styled.div`
  ${(props) => props.theme.displayFlex};
  gap: 10px;
  cursor: pointer;
`;

const Alert = styled.div<StyleType>`
  position: relative;

  &:before {
    content: "${(props) => props.alert}";
    position: absolute;
    top: -8px;
    right: -8px;
    background: red;
    color: #fff;
    border-radius: 50%;
    font-size: 0.75rem;
    padding: 1px 4px;

    @media (min-width: 320px) and (max-width: 480px) {
      padding: 0 2px;
    }
  }
`;

const Icon = styled.img`
  width: 26px;
  height: 26px;
  display: inline-block;

  padding: 2px;
  ${(props) => props.theme.iconColor};
  color: #fff;
  cursor: pointer;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 20px;
    height: 20px;
  }
`;

const ProfileImg = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

export default Nav;

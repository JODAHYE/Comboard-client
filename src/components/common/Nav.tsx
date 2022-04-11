import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { mainMenuClick, onPopupClick } from "../../features/menuSlice";
import { auth, logout } from "../../features/userSlice";
import { useMenu } from "../../hooks/useMenu";
import { Link, useNavigate } from "react-router-dom";
import { board_init } from "../../features/boardSlice";
import AlertPopup from "../alert/AlertPopup";
type StyleType = {
  alert: number;
};

const Nav: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mainMenu, onPopup } = useSelector((state: RootState) => state.menu);
  const { is_auth, profileImage, alertCount, kakaoAccessToken } = useSelector(
    (state: RootState) => state.user
  );
  useEffect(() => {
    dispatch(auth());
  }, []);
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
  return (
    <Wrap>
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
      {!is_auth && (
        <LoginBtn
          onClick={() => {
            navigate("/login");
          }}
        >
          로그인
        </LoginBtn>
      )}

      {is_auth && (
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
              onClick={() => {
                dispatch(onPopupClick("alert"));
              }}
            />
          </Alert>
          <Icon
            src="../../../icon/exit.svg"
            title="로그아웃"
            onClick={() => {
              dispatch(onPopupClick(""));
              dispatch(logout(kakaoAccessToken));
            }}
          />
        </MyInfo>
      )}
      {onPopup === "alert" && <AlertPopup />}
    </Wrap>
  );
};
export default Nav;

const Wrap = styled.div`
  width: 100vw;
  height: 5vh;
  background: ${(props) => props.theme.colors.main};
  display: flex;
  align-items: center;
  box-shadow: 2px 2px 2px 2px ${(props) => props.theme.colors.shadow};
  justify-content: space-between;
  padding: 0 50px;
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 0 10px;
    height: 6vh;
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
  font-size: 20px;
  cursor: pointer;
  text-decoration: none;
  font-family: BMHANNAAir;
  color: ${(props) => props.theme.colors.fontColor};
  &.active {
    color: #fff;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 15px;
    /* font-family: SpoqaHanSansNeoRegular; */
  }
`;
const LoginBtn = styled.button`
  display: none;
  @media (min-width: 320px) and (max-width: 480px) {
    display: block;
    outline: none;
    border: none;
    font-size: 14px;
    color: #fff;
    padding: 2px;
    border-radius: 4px;
    cursor: pointer;
    background: ${(props) => props.theme.colors.button};
  }
`;
const MyInfo = styled.div`
  cursor: pointer;
  ${(props) => props.theme.displayFlex};
  gap: 10px;
`;

const Alert = styled.div<StyleType>`
  position: relative;
  &:before {
    content: "${(props) => props.alert}";
    background: red;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
    padding: 1px 4px;
    position: absolute;
    top: -8px;
    right: -8px;
    @media (min-width: 320px) and (max-width: 480px) {
      font-size: 10px;
      padding: 0 2px;
    }
  }
`;

const Icon = styled.img`
  display: inline-block;
  padding: 2px;
  width: 26px;
  height: 26px;
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
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { RootState } from "../../app/store";
import { mypageClick } from "../../features/menuSlice";
import { useMenu } from "../../hooks/useMenu";

type StyleType = {
  isActive?: boolean;
  open?: boolean;
};

const MyPageMenu = () => {
  const dispatch = useDispatch();

  const { mypageMenu } = useSelector((state: RootState) => state.menu);

  const [menuOpen, setMenuOpen] = useState(false);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
      const target = e.target as HTMLParagraphElement;
      dispatch(mypageClick(target.innerHTML));
      setMenuOpen(false);
    },
    [dispatch]
  );

  const onOpenMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  return (
    <Wrap>
      <Header onClick={onOpenMenu}>
        <MobileMenuBar src="../../../icon/menu.svg" />
        <Title>마이페이지</Title>
      </Header>
      <List open={menuOpen}>
        <MenuItem isActive={useMenu(mypageMenu, "정보 수정")} onClick={onClick}>
          정보 수정
        </MenuItem>
        <MenuItem isActive={useMenu(mypageMenu, "내 게시글")} onClick={onClick}>
          내 게시글
        </MenuItem>
        <MenuItem isActive={useMenu(mypageMenu, "스크랩")} onClick={onClick}>
          스크랩
        </MenuItem>
        <MenuItem isActive={useMenu(mypageMenu, "내 댓글")} onClick={onClick}>
          내 댓글
        </MenuItem>
        <MenuItem
          isActive={useMenu(mypageMenu, "게시판 관리")}
          onClick={onClick}
        >
          게시판 관리
        </MenuItem>
      </List>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 16%;
  text-align: center;
  padding: 100px 0;
  border-right: 1px solid ${(props) => props.theme.colors.shadow};
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 10px 0;
    width: 100%;
  }
`;

const Header = styled.div`
  width: 100%;
  ${(props) => props.theme.displayFlex};
  gap: 10px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.button};
  font-size: 28px;
  font-family: SpoqaHanSansNeoBold;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 18px;
  }
`;

const MobileMenuBar = styled.img`
  display: none;
  @media (min-width: 320px) and (max-width: 480px) {
    display: inline;
  }
`;

const List = styled.div<StyleType>`
  width: 100%;
  ${(props) => props.theme.displayFlex};
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  margin-top: 100px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 16px;
    margin-top: 10px;
    gap: 8px;
    overflow: hidden;
    height: ${(props) => (props.open ? "140px" : "0px")};
    transition: 0.5s;
  }
`;

const MenuItem = styled.p<StyleType>`
  font-size: 20px;
  font-family: SpoqaHanSansNeoBold;
  cursor: pointer;
  transition: 0.4s;
  border-bottom: 1px solid transparent;
  font-weight: ${(props) => (props.isActive ? "600" : "300")};
  color: ${(props) => (props.isActive ? "#000" : props.theme.colors.fontColor)};
  &:hover {
    border-bottom: 1px solid ${(props) => props.theme.colors.fontColor};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 16px;
  }
`;

export default MyPageMenu;

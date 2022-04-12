import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../app/store";
import MyPageMenu from "../components/mypage/MyPageMenu";
import MyInfoUpdateComp from "../components/mypage/MyInfoUpdateComp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import MyPostList from "../components/mypage/MyPostList";
import MyScrapList from "../components/mypage/MyScrapList";
import MyCommentComp from "../components/mypage/MyCommentComp";
import MyBoardComp from "../components/mypage/MyBoardComp";
const cookies = new Cookies();
const MyPage = () => {
  const { mypageMenu } = useSelector((state: RootState) => state.menu);
  const navigate = useNavigate();
  useEffect(() => {
    if (!cookies.get("accessToken")) {
      return navigate("/");
    }
  }, []);
  return (
    <Wrap>
      <MyPageMenu />
      <Content>
        {mypageMenu === "정보 수정" && <MyInfoUpdateComp />}
        {mypageMenu === "내 게시글" && <MyPostList />}
        {mypageMenu === "스크랩" && <MyScrapList />}
        {mypageMenu === "내 댓글" && <MyCommentComp />}
        {mypageMenu === "게시판 관리" && <MyBoardComp />}
      </Content>
    </Wrap>
  );
};

export default MyPage;
const Wrap = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 95vh;
  overflow: auto;
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    height: 94vh;
  }
`;
const Content = styled.div`
  width: 80%;
  padding: 2%;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    height: auto;
    padding: 0 2% 40px;
  }
`;

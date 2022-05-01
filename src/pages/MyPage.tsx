import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../app/store";
import MyPageMenu from "../components/mypage/MyPageMenu";
import MyInfoUpdateComp from "../components/mypage/MyInfoUpdateComp";
import MyPostList from "../components/mypage/MyPostList";
import MyScrapList from "../components/mypage/MyScrapList";
import MyCommentComp from "../components/mypage/MyCommentComp";
import MyBoardComp from "../components/mypage/MyBoardComp";

const MyPage = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const { mypageMenu } = useSelector((state: RootState) => state.menu);

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
  width: 100%;
  height: 95vh;
  display: flex;
  position: relative;
  overflow: auto;
  @media (min-width: 320px) and (max-width: 480px) {
    height: 94vh;
    flex-direction: column;
    align-items: center;
  }
`;
const Content = styled.div`
  width: 80%;
  padding: 2%;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    padding: 2% 2% 40px;
  }
`;

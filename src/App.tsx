import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Main from "./pages/Main";
import Nav from "./components/common/Nav";
import BoardDetail from "./pages/BoardDetail";
import PostWrite from "./pages/PostWrite";
import PostDetail from "./pages/PostDetail";
import MyPage from "./pages/MyPage";
import UserDetailPage from "./pages/UserDetailPage";
import MobileLogin from "./pages/MobileLogin";
const Wrap = styled.div`
  width: 100vw;
  min-height: 100vh;
  overflow: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const App: React.FC = () => {
  return (
    <Wrap>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/board/:id" element={<BoardDetail />} />
          <Route path="/board/:id/write" element={<PostWrite />} />
          <Route path="/board/:id/:postId" element={<PostDetail />} />
          <Route path="/board/:id/:postId/update" element={<PostWrite />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/login" element={<MobileLogin />} />
          <Route path="/user/:userId" element={<UserDetailPage />} />
        </Routes>
      </BrowserRouter>
    </Wrap>
  );
};

export default App;

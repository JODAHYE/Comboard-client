import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { getAlertCount, getBookmarkList } from "../../features/userSlice";
import BookmarkBoardCard from "./BookmarkBoardCard";

const BookmarkBoard = () => {
  const dispatch = useDispatch();

  const { bookmarkBoardList } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getBookmarkList());
    dispatch(getAlertCount());
  }, []);

  return (
    <Wrap>
      <Menu>즐겨찾기</Menu>
      <List>
        {bookmarkBoardList.map((item, i) => {
          return <BookmarkBoardCard key={item._id} board={item} />;
        })}
      </List>
    </Wrap>
  );
};
export default BookmarkBoard;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
`;

const Menu = styled.div`
  ${(props) => props.theme.displayFlex};
  font-family: SpoqaHanSansNeoBold;
  justify-content: space-around;
  padding: 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.shadow};
`;

const List = styled.div`
  height: 94%;
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
